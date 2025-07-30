/**
 * Mermaid数据管理器
 * 
 * 用于管理Mermaid图表数据的内存存储，替代DOM属性存储方式
 * 
 * @author FlexiResume Team
 * @date 2025-07-25
 */

export interface MermaidChartData {
  id: string;
  chart: string;
  timestamp: number;
  isLazy?: boolean;
}

/**
 * Mermaid数据管理器类
 */
class MermaidDataManager {
  private static instance: MermaidDataManager;
  private chartData: Map<string, MermaidChartData> = new Map();

  private constructor() {}

  /**
   * 获取单例实例
   */
  public static getInstance(): MermaidDataManager {
    if (!MermaidDataManager.instance) {
      MermaidDataManager.instance = new MermaidDataManager();
    }
    return MermaidDataManager.instance;
  }

  /**
   * 存储图表数据
   */
  public setChartData(id: string, chart: string, isLazy: boolean = false): void {
    this.chartData.set(id, {
      id,
      chart,
      timestamp: Date.now(),
      isLazy
    });
  }

  /**
   * 获取图表数据
   */
  public getChartData(id: string): MermaidChartData | undefined {
    return this.chartData.get(id);
  }

  /**
   * 获取图表内容
   */
  public getChart(id: string): string | undefined {
    const data = this.chartData.get(id);
    return data?.chart;
  }

  /**
   * 检查图表是否存在
   */
  public hasChart(id: string): boolean {
    return this.chartData.has(id);
  }

  /**
   * 删除图表数据
   */
  public removeChart(id: string): boolean {
    return this.chartData.delete(id);
  }

  /**
   * 清空所有图表数据
   */
  public clearAll(): void {
    this.chartData.clear();
  }

  /**
   * 获取所有图表ID
   */
  public getAllChartIds(): string[] {
    return Array.from(this.chartData.keys());
  }

  /**
   * 获取图表数量
   */
  public getChartCount(): number {
    return this.chartData.size;
  }

  /**
   * 清理过期数据（超过1小时的数据）
   */
  public cleanupExpiredData(): void {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    for (const [id, data] of this.chartData.entries()) {
      if (now - data.timestamp > oneHour) {
        this.chartData.delete(id);
      }
    }
  }

  /**
   * 获取调试信息
   */
  public getDebugInfo(): {
    totalCharts: number;
    lazyCharts: number;
    regularCharts: number;
    chartIds: string[];
  } {
    const allData = Array.from(this.chartData.values());
    return {
      totalCharts: allData.length,
      lazyCharts: allData.filter(d => d.isLazy).length,
      regularCharts: allData.filter(d => !d.isLazy).length,
      chartIds: allData.map(d => d.id)
    };
  }
}

// 导出单例实例
export const mermaidDataManager = MermaidDataManager.getInstance();

// 定期清理过期数据
if (typeof window !== 'undefined') {
  setInterval(() => {
    mermaidDataManager.cleanupExpiredData();
  }, 30 * 60 * 1000); // 每30分钟清理一次
}
