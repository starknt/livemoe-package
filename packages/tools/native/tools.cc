#include "tools.h"
#include <string>

using namespace std;

void FindDesktopFolderView(REFIID riid, void **ppv)
{
	CComPtr<IShellWindows> shellWindow;

	if (FAILED(shellWindow.CoCreateInstance(CLSID_ShellWindows)))
	{
		return;
	}

	CComVariant vtLoc(CSIDL_DESKTOP);
	CComVariant vtEmpty;
	long lhwnd;
	CComPtr<IDispatch> spdisp;
	shellWindow->FindWindowSW(&vtLoc, &vtEmpty, SWC_DESKTOP, &lhwnd, SWFO_NEEDDISPATCH, &spdisp);

	CComPtr<IShellBrowser> shellBrowser;
	CComQIPtr<IServiceProvider>(spdisp)->QueryService(SID_STopLevelBrowser, IID_PPV_ARGS(&shellBrowser));

	CComPtr<IShellView> shellView;
	shellBrowser->QueryActiveShellView(&shellView);

	shellView->QueryInterface(riid, ppv);
}

class CCoInitialize
{
public:
	CCoInitialize() : m_hr(CoInitialize(NULL)) {}
	~CCoInitialize()
	{
		if (SUCCEEDED(m_hr))
			CoUninitialize();
	}
	operator HRESULT() const { return m_hr; }
	HRESULT m_hr;
};

Napi::Value GetSysListViewPosition(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();

	Napi::Array array = Napi::Array::New(env);

	CCoInitialize init;
	CComPtr<IFolderView> spView;
	FindDesktopFolderView(IID_PPV_ARGS(&spView));
	CComPtr<IShellFolder> spFolder;
	spView->GetFolder(IID_PPV_ARGS(&spFolder));

	CComPtr<IEnumIDList> spEnum;
	spView->Items(SVGIO_ALLVIEW, IID_PPV_ARGS(&spEnum));
	int c = 0;
	for (CComHeapPtr<ITEMID_CHILD> spidl; spEnum->Next(1, &spidl, nullptr) == S_OK; spidl.Free())
	{
		STRRET str;
		spFolder->GetDisplayNameOf(spidl, SHGDN_NORMAL, &str);
		LPTSTR spszName;
		StrRetToStr(&str, spidl, &spszName);

		POINT pt;
		spView->GetItemPosition(spidl, &pt);
		Napi::Object pointObj = Napi::Object::New(env);
		pointObj.Set("x", pt.x);
		pointObj.Set("y", pt.y);
		array.Set(c++, pointObj);
	}
	return array;
}

Napi::Value GetSysListViewIconRect(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();

	HWND folderView = FindSysFoldViewWindow();

	if (folderView)
	{
		int nMaxItem = ListView_GetItemCount(folderView);

		Napi::Array array = Napi::Array::New(env, nMaxItem);

		DWORD pid = 0;

		GetWindowThreadProcessId(folderView, &pid);

		HANDLE handle = OpenProcess(PROCESS_VM_OPERATION | PROCESS_VM_READ | PROCESS_VM_WRITE | PROCESS_QUERY_INFORMATION, FALSE, pid);

		if (handle != NULL)
		{
			PVOID prc = VirtualAllocEx(handle, NULL, sizeof(RECT), MEM_COMMIT, PAGE_READWRITE);
			if (prc)
			{
				SIZE_T numRead;
				for (int i = 0; i < nMaxItem; i++)
				{
					RECT rc;
					rc.left = LVIR_SELECTBOUNDS;
					WriteProcessMemory(handle, prc, &rc, sizeof(RECT), NULL);
					SendMessage(folderView, LVM_GETITEMRECT, (WPARAM)i, (LPARAM)prc);

					if (ReadProcessMemory(handle, prc, &rc, sizeof(RECT), &numRead))
					{
						Napi::Object rect = Napi::Object::New(env);
						rect.Set("left", rc.left);
						rect.Set("top", rc.top);
						rect.Set("right", rc.right);
						rect.Set("bottom", rc.bottom);
						array.Set(i, rect);
					}
				}
				VirtualFreeEx(handle, prc, 0, MEM_RELEASE);
			}
			CloseHandle(handle);
		}
		return array;
	}

	return Napi::Array::New(env);
}

Napi::Value GetSysTaskbarState(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();

	APPBARDATA taskbar;
	taskbar.cbSize = sizeof(APPBARDATA);

	SHAppBarMessage(ABM_GETTASKBARPOS, &taskbar);

	Napi::Object state = Napi::Object::New(env);

	switch (taskbar.uEdge)
	{
	case ABE_TOP:
		state.Set("align", "Top");
		break;
	case ABE_LEFT:
		state.Set("align", "Left");
		break;
	case ABE_RIGHT:
		state.Set("align", "Right");
		break;
	case ABE_BOTTOM:
		state.Set("align", "Bottom");
		break;
	}

	Napi::Object rc = Napi::Object::New(env);
	rc.Set("left", taskbar.rc.left);
	rc.Set("top", taskbar.rc.top);
	rc.Set("right", taskbar.rc.right);
	rc.Set("bottom", taskbar.rc.bottom);

	state.Set("rc", rc);

	return state;
}

Napi::Value SetWindowInWorkerW(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();

	if (info.Length() != 1)
	{
		throw Napi::Error(env, Napi::String::New(env, "too many parameters"));
	}

	if (info[0].As<Napi::Number>().Uint32Value())
	{
		if (workerw == nullptr)
		{
			CreateWorkerWindow();
			FindWorkerWWindow();

			if (workerw == nullptr)
			{
				workerw = FindProgmanWindow();
			}
		}

		HWND hWnd = (HWND)info[0].As<Napi::Number>().Uint32Value();

		SetParent(hWnd, workerw);

		ShowWindow(workerw, SW_SHOW);
	}

	return Napi::Boolean::New(env, true);
}

Napi::Value RestoreWorkerW(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();

	if (workerw == nullptr)
	{
		FindWorkerWWindow();

		if (workerw == nullptr)
		{
			workerw = FindProgmanWindow();
		}
	}
	else
	{
		ShowWindow(workerw, SW_HIDE);
	}

	return Napi::Boolean::New(env, true);
}

Napi::Boolean CheckAeroEnable(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();

	return Napi::Boolean::New(env, _checkAeroEnable());
}

Napi::Boolean EnableAero(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();

	return Napi::Boolean::New(env, _enableAero());
}

Napi::Value SetTaskbar(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();

	if (info.Length() != 1)
	{
		throw Napi::Error(env, Napi::String::New(env, "too many parameters"));
	}

	Napi::Object APPEARANCE = info[0].As<Napi::Object>();

	// TASKBAR_APPEARANCE APPEARANCE
	HWND taskbar = FindTraySheelWindow();

	uint32_t COLOR = APPEARANCE.Get("COLOR").As<Napi::Number>().Uint32Value();
	uint32_t ACCENT = APPEARANCE.Get("ACCENT").As<Napi::Number>().Uint32Value();

	SetWindowBlur(taskbar, (swca::ACCENT)ACCENT, COLOR);

	return Napi::Boolean::New(env, true);
}

Napi::Value RestoreTaskbar(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	HWND taskbar = FindTraySheelWindow();

	for (int i = 0; i < 30; i++)
		PostMessage(taskbar, WM_THEMECHANGED, 0, 0);
	return Napi::Boolean::New(env, true);
}

Napi::Value SetSystemCursorToNode(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	SystemParametersInfo(SPI_SETCURSORS, 0, 0, SPIF_SENDWININICHANGE);

	Napi::Object resource = info[0].As<Napi::Object>();

	string APPSTARTING = resource.Get("APPSTARTING").As<Napi::String>();
	string Normal = resource.Get("Normal").As<Napi::String>();
	string Hand = resource.Get("Hand").As<Napi::String>();
	string Cross = resource.Get("Cross").As<Napi::String>();
	string IBeam = resource.Get("IBeam").As<Napi::String>();
	string No = resource.Get("No").As<Napi::String>();
	string SizeAll = resource.Get("SizeAll").As<Napi::String>();
	string SizeNESW = resource.Get("SizeNESW").As<Napi::String>();
	string SizeNS = resource.Get("SizeNS").As<Napi::String>();
	string SizeNWSE = resource.Get("SizeNWSE").As<Napi::String>();
	string SizeWE = resource.Get("SizeWE").As<Napi::String>();
	string SizeUpArrow = resource.Get("SizeUpArrow").As<Napi::String>();
	string SizeWait = resource.Get("SizeWait").As<Napi::String>();

	HCURSOR cursor_APPSTARTING = LoadCursorFromFile((LPCSTR)APPSTARTING.c_str());
	SetSystemCursor(cursor_APPSTARTING, OCR_APPSTARTING);

	HCURSOR cursor_Normal = LoadCursorFromFile((LPCSTR)(Normal.c_str()));
	SetSystemCursor(cursor_Normal, OCR_NORMAL);

	HCURSOR cursor_Hand = LoadCursorFromFile((LPCSTR)(Hand.c_str()));
	SetSystemCursor(cursor_Hand, OCR_HAND);

	HCURSOR cursor_Crosshair = LoadCursorFromFile((LPCSTR)(Cross.c_str()));
	SetSystemCursor(cursor_Crosshair, OCR_CROSS);

	HCURSOR cursor_IBeam = LoadCursorFromFile((LPCSTR)(IBeam.c_str()));
	SetSystemCursor(cursor_IBeam, OCR_IBEAM);
	// SetSystemCursor(cursor_IBeam, OCR_SIZE);

	HCURSOR cursor_No = LoadCursorFromFile((LPCSTR)(No.c_str()));
	SetSystemCursor(cursor_No, OCR_NO);

	HCURSOR cursor_SizeAll = LoadCursorFromFile((LPCSTR)(SizeAll.c_str()));
	SetSystemCursor(cursor_SizeAll, OCR_SIZEALL);

	HCURSOR cursor_SizeNESW = LoadCursorFromFile((LPCSTR)(SizeNESW.c_str()));
	SetSystemCursor(cursor_SizeNESW, OCR_SIZENESW);

	HCURSOR cursor_SizeNS = LoadCursorFromFile((LPCSTR)(SizeNS.c_str()));
	SetSystemCursor(cursor_SizeNS, OCR_SIZENS);

	HCURSOR cursor_SizeNWSE = LoadCursorFromFile((LPCSTR)(SizeNWSE.c_str()));
	SetSystemCursor(cursor_SizeNWSE, OCR_SIZENWSE);

	HCURSOR cursor_SizeWE = LoadCursorFromFile((LPCSTR)(SizeWE.c_str()));
	SetSystemCursor(cursor_SizeWE, OCR_SIZEWE);

	HCURSOR cursor_SizeUpArrow = LoadCursorFromFile((LPCSTR)(SizeUpArrow.c_str()));
	SetSystemCursor(cursor_SizeUpArrow, OCR_UP);

	HCURSOR cursor_SizeWait = LoadCursorFromFile((LPCSTR)(SizeWait.c_str()));
	SetSystemCursor(cursor_SizeWait, OCR_WAIT);

	return Napi::Boolean::New(env, true);
}

Napi::Value RestoreSystemCursor(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();

	SystemParametersInfo(SPI_SETCURSORS, 0, 0, SPIF_SENDWININICHANGE);

	return Napi::Boolean::New(env, true);
}

Napi::Value HideDesktopIcon(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	if (FoldView == nullptr)
	{
		FoldView = FindSysFoldViewWindow();
	}

	if (FoldView != nullptr)
		ShowWindow(FoldView, SW_HIDE);
	else
	{
		return Napi::Boolean::New(env, false);
	}
	return Napi::Boolean::New(env, true);
}

Napi::Value ShowDesktopIcon(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	if (FoldView == nullptr)
	{
		FoldView = FindSysFoldViewWindow();
	}

	if (FoldView != nullptr)
		ShowWindow(FoldView, SW_SHOW);
	else
	{
		return Napi::Boolean::New(env, false);
	}

	return Napi::Boolean::New(env, true);
}

Napi::Value HideShellWindow(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	HWND shell = FindTraySheelWindow();

	if (shell != nullptr)
		ShowWindow(shell, SW_HIDE);
	else
	{
		return Napi::Boolean::New(env, false);
	}

	return Napi::Boolean::New(env, true);
}

Napi::Value ShowShellWindow(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();
	HWND shell = FindTraySheelWindow();

	if (shell != nullptr)
		ShowWindow(shell, SW_SHOW);
	else
	{
		return Napi::Boolean::New(env, false);
	}

	return Napi::Boolean::New(env, true);
}

Napi::Value QueryUserState(const Napi::CallbackInfo &info)
{
	Napi::Env env = info.Env();

	QUERY_USER_NOTIFICATION_STATE pquns;

	SHQueryUserNotificationState(&pquns);

	return Napi::Number::New(env, pquns);
}

Napi::Value IsInDesktop(const Napi::CallbackInfo &info)
{
	return Napi::Boolean::New(info.Env(), IsDesktop());
}