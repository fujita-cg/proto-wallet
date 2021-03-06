module.exports = {
  'env': {
    'commonjs': true,
    'es6': true,
    'node': true,
  },
  'extends': [
    'google',
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parserOptions': {
    'ecmaVersion': 2018,
  },
  'rules': {
    'new-cap': ['off'],
    'max-len': ['error', {
      'ignoreComments': true,
      'ignoreStrings': true,
      'ignoreTemplateLiterals': true 
    }],
  },
};
