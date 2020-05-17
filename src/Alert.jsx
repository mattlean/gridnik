const PropTypes = require('prop-types')
const React = require('react')

/**
 * Alert message to display error and warnings messages to user.
 */
const Alert = ({ txt, type }) => {
  if (type == 'err' || type == 'warn') {
    return <p className={`alert ${type}`}>{txt}</p>
  }
  return <p className="alert">{txt}</p>
}

Alert.propTypes = {
  txt: PropTypes.string,
  type: PropTypes.string,
}

module.exports = Alert
