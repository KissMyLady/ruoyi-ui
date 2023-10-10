import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'
// 在线密钥对生成 http://web.chacuo.net/netrsakeypair

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
ok 这是放置私钥
-----END RSA PRIVATE KEY-----`

const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8rni4pwyPSt1RdF5WFnylybai
4ULfLQD3xc4QUSb0Y6gz4K+M5iuXOzzM9nLlfiZU4rq/pCOtEgPC1EFZz22nyUWE
R7L1TjD4vrCo7mc1V5psq5XZCAPX5XGI+sGHAupTEPADj7fQhVjWFA1L7N0Go8Pf
Wf+HrrCm0twoExj0YQIDAQAB
-----END PUBLIC KEY-----`

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey) // 设置私钥
  return encryptor.decrypt(txt) // 对数据进行解密
}

