import React from 'react';

export const Icon = ({ className, type }) => (
  <i className={`fa fa-${type} ${className}`} aria-hidden="true"></i>
);

export function wrap(Tag) {
  return ({ children }) => <Tag>{children}</Tag>
}

export function GetWordByPos(str, pos) {
    var left = str.substr(0, pos);
    var right = str.substr(pos);

    left = left.replace(/^.+ /g, "");
    right = right.replace(/ .+$/g, "");

    return left + right;
}
