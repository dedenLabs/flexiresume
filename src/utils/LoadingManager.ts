/**
 * 加载状态管理器
 * 
 * 提供全局加载状态管理、进度跟踪、超时处理等功能
 * 
 * 主要功能：
 * - 📊 全局加载状态管理
 * - 📈 加载进度跟踪
 * - ⏱️ 超时检测和处理
 * - 🎯 任务优先级管理
 * - 📱 用户友好的状态提示
 * 
 * @author 陈剑
 * @date 2025-01-13
 */

import { isDebugEnabled } from './Tools';

// 加载任务状态
export type LoadingTaskStatus = 'pending' | 'loading' | 'success' | 'error' | 'timeout';

// 加载任务优先级
export type LoadingTaskPriority = 'low' | 'normal' | 'high' | 'critical';

// 加载任务接口
export interface LoadingTask {
  id: string;
  name: string;
  status: LoadingTaskStatus;
  priority: LoadingTaskPriority;
  progress: number; // 0-100
  startTime: number;
  endTime?: number;
  timeout?: number;
  error?: string;
  metadata?: Record<string, any>;
}

// 全局加载状态
export interface GlobalLoadingState {
  isLoading: boolean;
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  overallProgress: number;
  currentTask?: LoadingTask;
  estimatedTimeRemaining?: number;
}

// 状态监听器
type LoadingStateListener = (state: GlobalLoadingState) => void;
type TaskUpdateListener = (task: LoadingTask) => void;

// 内部状态
const tasks = new Map<string, LoadingTask>();
const stateListeners = new Set<LoadingStateListener>();
const taskListeners = new Set<TaskUpdateListener>();

// 默认超时时间（毫秒）
const DEFAULT_TIMEOUT = 30000; // 30秒

/**
 * 生成唯一任务ID
 */
function generateTaskId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 计算全局加载状态
 */
function calculateGlobalState(): GlobalLoadingState {
  const allTasks = Array.from(tasks.values());
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(t => t.status === 'success').length;
  const failedTasks = allTasks.filter(t => t.status === 'error' || t.status === 'timeout').length;
  const loadingTasks = allTasks.filter(t => t.status === 'loading');
  
  // 计算总体进度
  let overallProgress = 0;
  if (totalTasks > 0) {
    const totalProgress = allTasks.reduce((sum, task) => {
      if (task.status === 'success') return sum + 100;
      if (task.status === 'error' || task.status === 'timeout') return sum + 0;
      return sum + task.progress;
    }, 0);
    overallProgress = Math.round(totalProgress / totalTasks);
  }
  
  // 找到当前最高优先级的加载任务
  const currentTask = loadingTasks
    .sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, normal: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    })[0];
  
  // 估算剩余时间
  let estimatedTimeRemaining: number | undefined;
  if (loadingTasks.length > 0 && overallProgress > 0) {
    const avgTaskTime = allTasks
      .filter(t => t.endTime)
      .reduce((sum, t) => sum + (t.endTime! - t.startTime), 0) / 
      Math.max(1, completedTasks);
    
    if (avgTaskTime > 0) {
      const remainingTasks = totalTasks - completedTasks - failedTasks;
      estimatedTimeRemaining = Math.round(avgTaskTime * remainingTasks / 1000); // 转换为秒
    }
  }
  
  return {
    isLoading: loadingTasks.length > 0,
    totalTasks,
    completedTasks,
    failedTasks,
    overallProgress,
    currentTask,
    estimatedTimeRemaining
  };
}

/**
 * 通知状态监听器
 */
function notifyStateListeners() {
  const state = calculateGlobalState();
  
  if (isDebugEnabled()) {
    console.log('[LoadingManager] State updated:', state);
  }
  
  stateListeners.forEach(listener => {
    try {
      listener(state);
    } catch (error) {
      console.error('[LoadingManager] Error in state listener:', error);
    }
  });
}

/**
 * 通知任务监听器
 */
function notifyTaskListeners(task: LoadingTask) {
  taskListeners.forEach(listener => {
    try {
      listener(task);
    } catch (error) {
      console.error('[LoadingManager] Error in task listener:', error);
    }
  });
}

/**
 * 检查任务超时
 */
function checkTaskTimeout(taskId: string) {
  const task = tasks.get(taskId);
  if (!task || task.status !== 'loading') {
    return;
  }
  
  const now = Date.now();
  const timeout = task.timeout || DEFAULT_TIMEOUT;
  
  if (now - task.startTime > timeout) {
    updateTaskStatus(taskId, 'timeout', `Task timed out after ${timeout}ms`);
  }
}

/**
 * 更新任务状态
 */
function updateTaskStatus(
  taskId: string, 
  status: LoadingTaskStatus, 
  error?: string,
  progress?: number
) {
  const task = tasks.get(taskId);
  if (!task) return;
  
  task.status = status;
  if (error) task.error = error;
  if (progress !== undefined) task.progress = Math.max(0, Math.min(100, progress));
  
  if (status === 'success' || status === 'error' || status === 'timeout') {
    task.endTime = Date.now();
    task.progress = status === 'success' ? 100 : task.progress;
  }
  
  if (isDebugEnabled()) {
    console.log(`[LoadingManager] Task ${taskId} updated:`, { status, progress, error });
  }
  
  notifyTaskListeners(task);
  notifyStateListeners();
}

/**
 * 创建加载任务
 */
export function createLoadingTask(
  name: string,
  priority: LoadingTaskPriority = 'normal',
  timeout?: number,
  metadata?: Record<string, any>
): string {
  const taskId = generateTaskId();
  
  const task: LoadingTask = {
    id: taskId,
    name,
    status: 'pending',
    priority,
    progress: 0,
    startTime: Date.now(),
    timeout,
    metadata
  };
  
  tasks.set(taskId, task);
  
  if (isDebugEnabled()) {
    console.log(`[LoadingManager] Task created: ${taskId} - ${name}`);
  }
  
  notifyTaskListeners(task);
  notifyStateListeners();
  
  return taskId;
}

/**
 * 开始加载任务
 */
export function startLoadingTask(taskId: string): void {
  updateTaskStatus(taskId, 'loading');
  
  // 设置超时检查
  const task = tasks.get(taskId);
  if (task?.timeout) {
    setTimeout(() => checkTaskTimeout(taskId), task.timeout);
  }
}

/**
 * 更新任务进度
 */
export function updateTaskProgress(taskId: string, progress: number): void {
  const task = tasks.get(taskId);
  if (!task || task.status !== 'loading') return;
  
  updateTaskStatus(taskId, 'loading', undefined, progress);
}

/**
 * 完成加载任务
 */
export function completeLoadingTask(taskId: string): void {
  updateTaskStatus(taskId, 'success');
}

/**
 * 任务失败
 */
export function failLoadingTask(taskId: string, error: string): void {
  updateTaskStatus(taskId, 'error', error);
}

/**
 * 取消加载任务
 */
export function cancelLoadingTask(taskId: string): void {
  const task = tasks.get(taskId);
  if (task) {
    tasks.delete(taskId);
    
    if (isDebugEnabled()) {
      console.log(`[LoadingManager] Task cancelled: ${taskId}`);
    }
    
    notifyStateListeners();
  }
}

/**
 * 获取任务信息
 */
export function getLoadingTask(taskId: string): LoadingTask | undefined {
  return tasks.get(taskId);
}

/**
 * 获取所有任务
 */
export function getAllLoadingTasks(): LoadingTask[] {
  return Array.from(tasks.values());
}

/**
 * 获取全局加载状态
 */
export function getGlobalLoadingState(): GlobalLoadingState {
  return calculateGlobalState();
}

/**
 * 添加状态监听器
 */
export function addLoadingStateListener(listener: LoadingStateListener): () => void {
  stateListeners.add(listener);
  
  // 立即调用一次
  listener(calculateGlobalState());
  
  return () => {
    stateListeners.delete(listener);
  };
}

/**
 * 添加任务监听器
 */
export function addTaskUpdateListener(listener: TaskUpdateListener): () => void {
  taskListeners.add(listener);
  
  return () => {
    taskListeners.delete(listener);
  };
}

/**
 * 清理已完成的任务
 */
export function cleanupCompletedTasks(olderThanMs = 60000): void {
  const now = Date.now();
  let cleanedCount = 0;
  
  for (const [taskId, task] of tasks.entries()) {
    if ((task.status === 'success' || task.status === 'error' || task.status === 'timeout') &&
        task.endTime && (now - task.endTime > olderThanMs)) {
      tasks.delete(taskId);
      cleanedCount++;
    }
  }
  
  if (cleanedCount > 0) {
    if (isDebugEnabled()) {
      console.log(`[LoadingManager] Cleaned up ${cleanedCount} completed tasks`);
    }
    notifyStateListeners();
  }
}

/**
 * 清理所有任务
 */
export function clearAllTasks(): void {
  tasks.clear();
  
  if (isDebugEnabled()) {
    console.log('[LoadingManager] All tasks cleared');
  }
  
  notifyStateListeners();
}

/**
 * 自动清理定时器
 */
let cleanupInterval: NodeJS.Timeout | null = null;

/**
 * 启动自动清理
 */
export function startAutoCleanup(intervalMs = 300000): void { // 5分钟
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
  }
  
  cleanupInterval = setInterval(() => {
    cleanupCompletedTasks();
  }, intervalMs);
  
  if (isDebugEnabled()) {
    console.log('[LoadingManager] Auto cleanup started');
  }
}

/**
 * 停止自动清理
 */
export function stopAutoCleanup(): void {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
    
    if (isDebugEnabled()) {
      console.log('[LoadingManager] Auto cleanup stopped');
    }
  }
}
