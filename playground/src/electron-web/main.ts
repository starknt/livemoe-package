const sendBtn = document.querySelector('#sendBtn')
const content = document.querySelector('#cot')
const msgDom: HTMLInputElement | null = document.querySelector('#msg')

const messages: any[] = []

sendBtn?.addEventListener('click', () => {
  messages.push({
    type: 'send',
    msg: msgDom?.value,
  })

  window.ipc.call('test', msgDom?.value)
    .then((res: any) => {
      messages.push({
        type: 'receive',
        msg: res,
      })
    })
    .catch((err: Error) => console.error(err))
})

setInterval(() => {
  let text = ''

  messages.forEach((msg) => {
    if (msg.type === 'send')
      text += `<div class="send">发送消息: ${msg.msg}</div>`

    if (msg.type === 'receive')
      text += `<div class="receive">接收消息: ${msg.msg}</div>`
  })

  if (content)
    content.innerHTML = text
}, 1000)