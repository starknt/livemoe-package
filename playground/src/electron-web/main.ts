const sendBtn = document.querySelector('#sendBtn')
const content = document.querySelector('#cot')

sendBtn?.addEventListener('click', () => {
  window.ipc.call('test')
    .then((res: any) => {
      if (content)
        content.innerHTML = res
    })
    .catch((err: Error) => console.error(err))
})