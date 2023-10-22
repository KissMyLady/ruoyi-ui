import Clipboard from 'clipboard'
import TipMessage from '@/utils/myUtils/TipMessage'

function clipboardSuccess(text) {
  TipMessage.isOK('复制成功: ' + text)
}

function clipboardError() {
  TipMessage.Error('复制失败')
}

export default function handleClipboard(text, event) {
  const clipboard = new Clipboard(event.target, {
    text: () => text
  })
  clipboard.on('success', () => {
    clipboardSuccess(text)
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboardError()
    clipboard.destroy()
  })
  clipboard.onClick(event)
}
