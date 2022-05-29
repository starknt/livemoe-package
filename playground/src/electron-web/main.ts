const sendBtn = document.querySelector('#sendBtn')
const content = document.querySelector('#cot')
const msgDom: HTMLInputElement | null = document.querySelector('#msg')

const messages: any[] = []

function sendMessage() {
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
}

msgDom?.addEventListener('keyup', (e) => {
  if (e.key.toLowerCase() === 'enter')
    sendMessage()
})

sendBtn?.addEventListener('click', sendMessage)

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