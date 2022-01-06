export function x25crc(buffer: Buffer, start = 0, trim = 0, magic = null) {
  let crc = 0xffff;

  const digest = byte => {
    let tmp = (byte & 0xff) ^ (crc & 0xff);
    tmp ^= tmp << 4;
    tmp &= 0xff;
    crc = (crc >> 8) ^ (tmp << 8) ^ (tmp << 3) ^ (tmp >> 4);
    crc &= 0xffff;
  }

  for (let i = start; i < buffer.length - trim; i++) {
    digest(buffer[i])
  }

  if (magic !== null) {
    digest(magic)
  }

  return crc;
}

export function hex(n: number, len: number = 2, prefix = '0x') {
  return `${prefix}${n.toString(16).padStart(len, '0')}`
}

export function dump(buffer: Buffer, lineWidth = 16) {
  const line = []
  let address = 0
  for (let i = 0; i < buffer.length; i++) {
    line.push(hex(buffer[i], 2, '0x'))
    if (line.length === lineWidth) {
      console.log(hex(address, 4), '|', line.join(' '))
      address += lineWidth
      line.length = 0
    }
  }
  if (line.length > 0) {
    console.log(hex(address, 4), '|', line.join(' '))
  }
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function waitFor(cb, timeout = 10000, interval = 100) {
  return new Promise((resolve, reject) => {
    const timeoutTimer = setTimeout(() => {
      cleanup()
      reject('Timeout')
    }, timeout)

    const intervalTimer = setInterval(() => {
      const result = cb()
      if (result) {
        cleanup()
        resolve(result)
      }
    })

    const cleanup = () => {
      clearTimeout(timeoutTimer)
      clearTimeout(intervalTimer)
    }
  })
}
