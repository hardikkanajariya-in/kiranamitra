const React = require('react');

const SvgMock = React.forwardRef((props, ref) => {
  return React.createElement('svg', { ...props, ref });
});

SvgMock.displayName = 'SvgMock';

module.exports = SvgMock;
module.exports.default = SvgMock;
