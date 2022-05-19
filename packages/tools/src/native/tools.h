#ifndef TOOLS_H
#define TOOLS_H
#include "user32.h"
#include <atlstr.h>
#include <atlbase.h>
#include <ExDisp.h>
#include <ShlObj.h>
#include <Shlwapi.h>
#include <winerror.h>
#include <napi.h>

void FindDesktopFolderView(REFIID riid, void **ppv);
Napi::Value GetSysListViewPosition(const Napi::CallbackInfo &info);
Napi::Value GetSysTaskbarState(const Napi::CallbackInfo &info);
Napi::Value GetSysListViewIconRect(const Napi::CallbackInfo &info);

Napi::Value SetWindowInWorkerW(const Napi::CallbackInfo &info);
Napi::Value RestoreWorkerW(const Napi::CallbackInfo &info);

Napi::Boolean CheckAeroEnable(const Napi::CallbackInfo &info);
Napi::Boolean EnableAero(const Napi::CallbackInfo &info);

Napi::Value SetTaskbar(const Napi::CallbackInfo &info);
Napi::Value RestoreTaskbar(const Napi::CallbackInfo &info);

Napi::Value SetSystemCursorToNode(const Napi::CallbackInfo &info);
Napi::Value RestoreSystemCursor(const Napi::CallbackInfo &info);

Napi::Value ShowDesktopIcon(const Napi::CallbackInfo &info);
Napi::Value HideDesktopIcon(const Napi::CallbackInfo &info);

Napi::Value ShowShellWindow(const Napi::CallbackInfo &info);
Napi::Value HideShellWindow(const Napi::CallbackInfo &info);

Napi::Value QueryUserState(const Napi::CallbackInfo &info);
Napi::Value IsInDesktop(const Napi::CallbackInfo &info);
#endif