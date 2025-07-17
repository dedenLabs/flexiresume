/**
 * 数据验证中间件
 * 提供简历数据的完整性验证和安全检查
 */

import { SecurityUtils, ValidationRules } from './SecurityUtils';
import type { IFlexiResume } from '../types/FlexiResumeTypes';

/**
 * 验证结果接口
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  sanitizedData?: any;
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion: string;
}

/**
 * 数据验证器类
 */
export class DataValidator {
  private static instance: DataValidator;
  private validationRules: Map<string, ValidationRule[]> = new Map();

  private constructor() {
    this.initializeValidationRules();
  }

  static getInstance(): DataValidator {
    if (!DataValidator.instance) {
      DataValidator.instance = new DataValidator();
    }
    return DataValidator.instance;
  }

  /**
   * 初始化验证规则
   */
  private initializeValidationRules(): void {
    // 个人信息验证规则
    this.addValidationRule('personal_info', [
      {
        field: 'name',
        required: true,
        validator: (value: string) => value && value.length >= 2 && value.length <= 50,
        message: '姓名长度应在2-50个字符之间'
      },
      {
        field: 'email',
        required: false,
        validator: (value: string) => !value || SecurityUtils.validateEmail(value),
        message: '邮箱格式不正确'
      },
      {
        field: 'phone',
        required: false,
        validator: (value: string) => !value || SecurityUtils.validatePhone(value),
        message: '电话号码格式不正确'
      },
      {
        field: 'location',
        required: false,
        validator: (value: string) => !value || (value.length >= 2 && value.length <= 100),
        message: '地址长度应在2-100个字符之间'
      }
    ]);

    // 工作经历验证规则
    this.addValidationRule('employment_history', [
      {
        field: 'company',
        required: true,
        validator: (value: string) => value && value.length >= 2 && value.length <= 100,
        message: '公司名称长度应在2-100个字符之间'
      },
      {
        field: 'position',
        required: true,
        validator: (value: string) => value && value.length >= 2 && value.length <= 50,
        message: '职位名称长度应在2-50个字符之间'
      },
      {
        field: 'start_time',
        required: true,
        validator: (value: string) => ValidationRules.yearMonth.test(value),
        message: '开始时间格式应为YYYY-MM'
      },
      {
        field: 'end_time',
        required: false,
        validator: (value: string) => !value || ValidationRules.yearMonth.test(value) || value === '至今',
        message: '结束时间格式应为YYYY-MM或"至今"'
      },
      {
        field: 'description',
        required: false,
        validator: (value: string) => !value || value.length <= 2000,
        message: '工作描述长度不应超过2000个字符'
      }
    ]);

    // 技能验证规则
    this.addValidationRule('skills', [
      {
        field: 'name',
        required: true,
        validator: (value: string) => ValidationRules.skillName.test(value),
        message: '技能名称格式不正确'
      },
      {
        field: 'level',
        required: true,
        validator: (value: number) => Number.isInteger(value) && value >= 1 && value <= 5,
        message: '技能等级应为1-5的整数'
      }
    ]);

    // 项目经验验证规则
    this.addValidationRule('projects', [
      {
        field: 'name',
        required: true,
        validator: (value: string) => value && value.length >= 2 && value.length <= 100,
        message: '项目名称长度应在2-100个字符之间'
      },
      {
        field: 'description',
        required: false,
        validator: (value: string) => !value || value.length <= 1000,
        message: '项目描述长度不应超过1000个字符'
      },
      {
        field: 'url',
        required: false,
        validator: (value: string) => !value || SecurityUtils.isSecureURL(value),
        message: '项目链接格式不正确或不安全'
      }
    ]);
  }

  /**
   * 添加验证规则
   */
  addValidationRule(category: string, rules: ValidationRule[]): void {
    this.validationRules.set(category, rules);
  }

  /**
   * 验证完整的简历数据
   */
  validateResumeData(data: IFlexiResume): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const sanitizedData = JSON.parse(JSON.stringify(data)); // 深拷贝

    try {
      // 验证个人信息
      if (data.personal_info) {
        const personalResult = this.validateSection('personal_info', data.personal_info);
        errors.push(...personalResult.errors);
        warnings.push(...personalResult.warnings);
      }

      // 验证工作经历
      if (data.employment_history?.list) {
        data.employment_history.list.forEach((item, index) => {
          const result = this.validateSection('employment_history', item);
          errors.push(...result.errors.map(err => ({
            ...err,
            field: `employment_history[${index}].${err.field}`
          })));
          warnings.push(...result.warnings.map(warn => ({
            ...warn,
            field: `employment_history[${index}].${warn.field}`
          })));
        });
      }

      // 验证技能
      if (data.skill_level?.list) {
        data.skill_level.list.forEach((skill, index) => {
          if (Array.isArray(skill) && skill.length >= 2) {
            const skillObj = { name: skill[0], level: skill[1] };
            const result = this.validateSection('skills', skillObj);
            errors.push(...result.errors.map(err => ({
              ...err,
              field: `skills[${index}].${err.field}`
            })));
          }
        });
      }

      // 验证项目经验
      if (data.personal_projects?.list) {
        data.personal_projects.list.forEach((project, index) => {
          const result = this.validateSection('projects', project);
          errors.push(...result.errors.map(err => ({
            ...err,
            field: `projects[${index}].${err.field}`
          })));
          warnings.push(...result.warnings.map(warn => ({
            ...warn,
            field: `projects[${index}].${warn.field}`
          })));
        });
      }

      // 检查敏感信息
      this.checkSensitiveInformation(data, warnings);

      // 清理和净化数据
      this.sanitizeResumeData(sanitizedData);

      return {
        isValid: errors.filter(e => e.severity === 'critical' || e.severity === 'high').length === 0,
        errors,
        warnings,
        sanitizedData
      };

    } catch (error) {
      console.error('Data validation failed:', error);
      return {
        isValid: false,
        errors: [{
          field: 'general',
          message: '数据验证过程中发生错误',
          severity: 'critical',
          code: 'VALIDATION_ERROR'
        }],
        warnings: []
      };
    }
  }

  /**
   * 验证数据段
   */
  private validateSection(category: string, data: any): ValidationResult {
    const rules = this.validationRules.get(category) || [];
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    for (const rule of rules) {
      const value = data[rule.field];

      // 检查必填字段
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push({
          field: rule.field,
          message: `${rule.field} 是必填字段`,
          severity: 'high',
          code: 'REQUIRED_FIELD'
        });
        continue;
      }

      // 跳过空值的非必填字段
      if (!rule.required && (value === undefined || value === null || value === '')) {
        continue;
      }

      // 执行验证
      try {
        if (!rule.validator(value)) {
          errors.push({
            field: rule.field,
            message: rule.message,
            severity: rule.severity || 'medium',
            code: rule.code || 'VALIDATION_FAILED'
          });
        }
      } catch (error) {
        errors.push({
          field: rule.field,
          message: `验证 ${rule.field} 时发生错误`,
          severity: 'medium',
          code: 'VALIDATOR_ERROR'
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 检查敏感信息
   */
  private checkSensitiveInformation(data: any, warnings: ValidationWarning[]): void {
    const checkContent = (content: string, fieldPath: string) => {
      if (!content || typeof content !== 'string') return;

      const sensitiveCheck = SecurityUtils.containsSensitiveInfo(content);
      if (sensitiveCheck.hasSensitive) {
        warnings.push({
          field: fieldPath,
          message: `检测到可能的敏感信息: ${sensitiveCheck.types.join(', ')}`,
          suggestion: '请确认是否需要在简历中包含此类信息'
        });

        SecurityUtils.logSecurityEvent({
          type: 'suspicious_activity',
          details: `Sensitive information detected in ${fieldPath}: ${sensitiveCheck.types.join(', ')}`
        });
      }
    };

    // 递归检查所有字符串字段
    const traverse = (obj: any, path: string = '') => {
      if (typeof obj === 'string') {
        checkContent(obj, path);
      } else if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          traverse(item, `${path}[${index}]`);
        });
      } else if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
          const newPath = path ? `${path}.${key}` : key;
          traverse(obj[key], newPath);
        });
      }
    };

    traverse(data);
  }

  /**
   * 清理和净化简历数据
   */
  private sanitizeResumeData(data: any): void {
    const sanitizeString = (str: string): string => {
      return SecurityUtils.sanitizeInput(str);
    };

    const traverse = (obj: any) => {
      if (typeof obj === 'string') {
        return sanitizeString(obj);
      } else if (Array.isArray(obj)) {
        return obj.map(item => traverse(item));
      } else if (obj && typeof obj === 'object') {
        const sanitized: any = {};
        Object.keys(obj).forEach(key => {
          sanitized[key] = traverse(obj[key]);
        });
        return sanitized;
      }
      return obj;
    };

    // 就地修改数据
    Object.keys(data).forEach(key => {
      data[key] = traverse(data[key]);
    });
  }

  /**
   * 生成验证报告
   */
  generateValidationReport(result: ValidationResult): string {
    const report = [];
    
    report.push('=== 数据验证报告 ===');
    report.push(`验证状态: ${result.isValid ? '✅ 通过' : '❌ 失败'}`);
    report.push(`错误数量: ${result.errors.length}`);
    report.push(`警告数量: ${result.warnings.length}`);
    report.push('');

    if (result.errors.length > 0) {
      report.push('错误详情:');
      result.errors.forEach((error, index) => {
        report.push(`${index + 1}. [${error.severity.toUpperCase()}] ${error.field}: ${error.message}`);
      });
      report.push('');
    }

    if (result.warnings.length > 0) {
      report.push('警告详情:');
      result.warnings.forEach((warning, index) => {
        report.push(`${index + 1}. ${warning.field}: ${warning.message}`);
        if (warning.suggestion) {
          report.push(`   建议: ${warning.suggestion}`);
        }
      });
    }

    return report.join('\n');
  }
}

/**
 * 验证规则接口
 */
interface ValidationRule {
  field: string;
  required: boolean;
  validator: (value: any) => boolean;
  message: string;
  severity?: 'critical' | 'high' | 'medium' | 'low';
  code?: string;
}

/**
 * 便捷的验证函数
 */
export const validateResumeData = (data: IFlexiResume): ValidationResult => {
  const validator = DataValidator.getInstance();
  return validator.validateResumeData(data);
};

export const generateValidationReport = (result: ValidationResult): string => {
  const validator = DataValidator.getInstance();
  return validator.generateValidationReport(result);
};
