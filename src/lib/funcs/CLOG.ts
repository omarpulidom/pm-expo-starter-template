const isDev = process.env.NODE_ENV === 'development'

export function CLOG(...args: unknown[]) {
  if (isDev) {
    console.log(JSON.stringify(args, null, 2))
  }
}

CLOG.error = (...args: unknown[]) => {
  if (isDev) {
    console.error('<--------- ERROR --------->')
    console.error(...args)
    console.error('<--------- ERROR --------->')
  }
}

CLOG.info = (...args: unknown[]) => {
  if (isDev) {
    console.info('<--------- INFO --------->')
    console.info(...args)
    console.info('<--------- INFO --------->')
  }
}

CLOG.server = {
  error: (...args: unknown[]) => {
    console.error('❌[server]: ', ...args)
  },
  info: (...args: unknown[]) => {
    console.info('⚡️[server]: ', ...args)
  },
  warn: (...args: unknown[]) => {
    console.warn('⚠️ [server]: ', ...args)
  },
}
