#pragma once
#ifndef WINDOW_H
#define WINDOW_H

// 从 Windows 头文件中添加鼠标相关的宏定义
#define OEMRESOURCE
// Windows 头文件
#include <Windows.h>
#include <shellapi.h>

#define WM_CREATE_WORKERW 0x052C
#define DWM_EC_ENABLECOMPOSITION 1

typedef HRESULT(__stdcall *fnDwmIsCompositionEnabled)(BOOL *pfEnabled);
typedef HRESULT(__stdcall *fnDwmEnableComposition)(UINT uCompositionAction);

extern HWND workerw;
extern HWND __workerw;
extern HWND FoldView;
extern HWND __DefView;

BOOL CALLBACK EnumWindowsProc(HWND tophandle, LPARAM lParam);

/*
 * 检查当前的前台窗口是否为桌面
 */
HWND FindProgmanWindow();

HWND FindTraySheelWindow();

/*
 *   显示桌面的按钮
 */
HWND FindPeekWindow();

HWND FindWorkerWWindow();

// 向Program发送消息, 使其分裂成两个WorkerW窗口
void CreateWorkerWindow();

BOOL _checkAeroEnable();

BOOL _enableAero();

HWND FindSysFoldViewWindow();

// 是否处于桌面
BOOL IsDesktop();

#endif