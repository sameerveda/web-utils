const LEVELS = {
  FINE: 600,
  DEBUG: 700,
  INFO: 800,
  WARNING: 900,
  SEVERE: 1000,
  OFF: 'OFF',
  ALL: 100000,
};

function createLogger(logging_level) {
  const level = LEVELS[logging_level.toUpperCase().trim()];
  if (!level) throw new Error('invalid log level: ' + logging_level + ', valid logging_levels: ' + LEVELS);

  /**
   *
   * @param {number} levelValue
   * @returns {typeof console.log}
   */
  function create(levelValue, callback) {
    if (level === 'OFF') return () => {};
    return level >= levelValue ? callback.bind(console) : () => {};
  }

  function enabled(levelValue) {
    if (level === 'OFF') return false;
    return level >= levelValue;
  }

  return Object.freeze({
    fine: create(LEVELS.FINE, console.debug),
    debug: create(LEVELS.DEBUG, console.debug),
    info: create(LEVELS.INFO, console.info),
    warning: create(LEVELS.INFO, console.warn),
    error: create(LEVELS.SEVERE, console.error),
    fine_enabled: enabled(LEVELS.FINE),
    debug_enabled: enabled(LEVELS.DEBUG),
    info_enabled: enabled(LEVELS.INFO),
    warning_enabled: enabled(LEVELS.INFO),
    error_enabled: enabled(LEVELS.SEVERE),
  });
}

let _logger = createLogger('INFO');

/**
 * @type {typeof _logger}
 */
export const logger = new Proxy(
  {},
  {
    get(_, prop) {
      return _logger[prop];
    },
  }
);

export default logger;
export const console_wrap = t => (console.log(t), t);
export function initLogger(logging_level) {
  _logger = createLogger(logging_level);
}
