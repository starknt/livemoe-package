#include "tools.h"

using namespace Napi;

Object Init(Env env, Object exports)
{
    exports.Set("GetSysListViewPosition", Function::New(env, GetSysListViewPosition));
    exports.Set("GetSysTaskbarState", Function::New(env, GetSysTaskbarState));
    exports.Set("GetSysListViewIconRect", Function::New(env, GetSysListViewIconRect));
    exports.Set("SetWindowInWorkerW", Function::New(env, SetWindowInWorkerW));
    exports.Set("RestoreWorkerW", Function::New(env, RestoreWorkerW));
    exports.Set("CheckAeroEnable", Function::New(env, CheckAeroEnable));
    exports.Set("EnableAero", Function::New(env, EnableAero));
    exports.Set("SetTaskbar", Function::New(env, SetTaskbar));
    exports.Set("RestoreTaskbar", Function::New(env, RestoreTaskbar));
    exports.Set("SetSystemCursorToNode", Function::New(env, SetSystemCursorToNode));
    exports.Set("RestoreSystemCursor", Function::New(env, RestoreSystemCursor));
    exports.Set("ShowDesktopIcon", Function::New(env, ShowDesktopIcon));
    exports.Set("HideDesktopIcon", Function::New(env, HideDesktopIcon));
    exports.Set("ShowShellWindow", Function::New(env, ShowShellWindow));
    exports.Set("HideShellWindow", Function::New(env, HideShellWindow));
    exports.Set("QueryUserState", Function::New(env, QueryUserState));
    exports.Set("IsInDesktop", Function::New(env, IsInDesktop));
    return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init);