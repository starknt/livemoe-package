#include "window.h"

HWND workerw = nullptr;
HWND __workerw = nullptr;
HWND FoldView = nullptr;
HWND __DefView = nullptr;

BOOL CALLBACK EnumWindowsProc(HWND tophandle, LPARAM lParam)
{
	HWND DefView = FindWindowEx(tophandle, NULL, TEXT("SHELLDLL_DefView"), TEXT(""));
	if (DefView != nullptr)
	{
		__DefView = DefView;
		__workerw = tophandle;
		FoldView = FindWindowEx(DefView, NULL, TEXT("SysListView32"), TEXT("FolderView"));
		workerw = FindWindowEx(nullptr, tophandle, TEXT("WorkerW"), TEXT(""));
		return FALSE;
	}
	return TRUE;
}

HWND FindProgmanWindow()
{
	return FindWindow(TEXT("Progman"), TEXT("Program Manager"));
}

HWND FindTraySheelWindow()
{
	return FindWindow(TEXT("Shell_TrayWnd"), TEXT(""));
}

HWND FindPeekWindow()
{
	HWND tray = FindTraySheelWindow();

	HWND notify = FindWindowEx(tray, nullptr, TEXT("TrayNotifyWnd"), TEXT(""));

	HWND peek = FindWindowEx(notify, nullptr, TEXT("TrayShowDesktopButtonWClass"), TEXT(""));

	return peek;
}

HWND FindWorkerWWindow()
{
	if (workerw == nullptr)
		EnumWindows(EnumWindowsProc, NULL);
	HWND _workerw = workerw;
	return _workerw;
}

void CreateWorkerWindow()
{
	PDWORD_PTR result = 0;
	HWND Progman = FindProgmanWindow();
	SendMessageTimeout(Progman, WM_CREATE_WORKERW, 0xD, 0x1, SMTO_NORMAL, 1000, result);
}

BOOL _checkAeroEnable()
{
	//注意这DWM API在Vista/Win7系统以上才有的
	// win8/win10是不需要判断的会一直返回TRUE
	BOOL bEnabled = FALSE;
	HMODULE hModuleDwm = LoadLibrary(TEXT("Dwmapi.dll"));
	if (hModuleDwm != 0)
	{
		fnDwmIsCompositionEnabled pFunc = (fnDwmIsCompositionEnabled)GetProcAddress(hModuleDwm, "DwmIsCompositionEnabled");
		if (pFunc != 0)
		{
			BOOL result = FALSE;
			if (pFunc(&result) == S_OK)
			{
				bEnabled = result;
			}
		}

		FreeLibrary(hModuleDwm);
		hModuleDwm = 0;
	}
	return bEnabled;
}

BOOL _enableAero()
{
	HMODULE hModuleDwm = LoadLibrary(TEXT("Dwmapi.dll"));
	if (hModuleDwm != 0)
	{
		fnDwmEnableComposition DwmEnableComposition = (fnDwmEnableComposition)GetProcAddress(hModuleDwm, "DwmEnableComposition");

		if (DwmEnableComposition != 0)
		{
			DwmEnableComposition(DWM_EC_ENABLECOMPOSITION);
			return true;
		}
		return false;
	}

	return false;
}

HWND FindSysFoldViewWindow()
{
	UINT uFindCount = 0;
	HWND hSysListView32Wnd = NULL;
	while (NULL == hSysListView32Wnd && uFindCount < 10)
	{
		HWND hParentWnd = ::GetShellWindow();
		HWND hSHELLDLL_DefViewWnd = ::FindWindowEx(hParentWnd, NULL, "SHELLDLL_DefView", NULL);
		hSysListView32Wnd = ::FindWindowEx(hSHELLDLL_DefViewWnd, NULL, "SysListView32", "FolderView");

		if (NULL == hSysListView32Wnd)
		{
			hParentWnd = ::FindWindowEx(NULL, NULL, "WorkerW", "");
			while ((!hSHELLDLL_DefViewWnd) && hParentWnd)
			{
				hSHELLDLL_DefViewWnd = ::FindWindowEx(hParentWnd, NULL, "SHELLDLL_DefView", NULL);
				hParentWnd = FindWindowEx(NULL, hParentWnd, "WorkerW", "");
			}
			hSysListView32Wnd = ::FindWindowEx(hSHELLDLL_DefViewWnd, 0, "SysListView32", "FolderView");
		}

		if (NULL == hSysListView32Wnd)
		{
			Sleep(1000);
			uFindCount++;
		}
		else
		{
			break;
		}
	}

	return hSysListView32Wnd;
}

BOOL IsDesktop()
{
	if (!workerw)
	{
		FindWorkerWWindow();
	}
	HWND current_win_foreg = GetForegroundWindow();

	return current_win_foreg == workerw || current_win_foreg == __workerw;
}