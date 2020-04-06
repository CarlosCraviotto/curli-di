module.exports = {
  "env": {
    "node": true,
    "mocha": true
  },
  "plugins": [
    "mocha"
  ],
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  extends: [
    "plugin:@typescript-eslint/recommended" // Uses the recommended rules from the @typescript-eslint/eslint-plugin
  ],
  "rules": {
    "comma-dangle": ["error", "always-multiline"],
    "no-cond-assign": "error",
    "no-console": "off",
    "no-unused-expressions": "error",
    "no-const-assign": "error",

    "array-bracket-spacing": ["error", "never"],
    "block-spacing": ["error", "always"],
    "brace-style": ["error", "1tbs", {"allowSingleLine": true}],
    "camelcase": ["error", {"properties": "always"}],
    "comma-spacing": ["error", {"before": false, "after": true}],
    "comma-style": ["error", "last"],
    "computed-property-spacing": ["error", "never"],
    "eol-last": ["error", "unix"],
    "func-names": 0,
    "func-call-spacing": ["error", "never"],
    "function-paren-newline": ["error", "consistent"],
    "indent": ["error", 4, {"SwitchCase": 1}],
    "key-spacing": ["error", {"beforeColon": false, "afterColon": true,
      "mode": "strict"}],
    "keyword-spacing": ["error", {
      "before": true,
      "after": true
    }],
    "max-len": ["error", 95, 4, {"ignoreComments": true, "ignoreUrls": true,
      "ignorePattern": "^\\s*var\\s.+=\\s*require\\s*\\("}],
    "mocha/handle-done-callback": "error",
    "mocha/no-exclusive-tests": "error",
    "mocha/no-identical-title": "error",
    "mocha/no-nested-tests": "error",
    "no-array-constructor": 2,
    "no-extra-semi": "error",
    "no-multi-spaces": "error",
    "no-multiple-empty-lines": ["error", { "max": 1 }],
    "no-redeclare": ["error"],
    "no-trailing-spaces": 2,
    "no-undef": "error",
    "no-var": "error",
    "object-curly-spacing": ["error", "never"],
    "one-var": ["error", {
      "initialized": "never",
      "uninitialized": "always"
    }],
    "operator-linebreak": ["error", "after"],
    "padded-blocks": ["error", { "classes": "always" }],
    "prefer-const": "error",
    "quotes": ["error", "single", "avoid-escape"],
    "semi-spacing": ["error", {"before": false, "after": true}],
    "semi": ["error", "always"],
    "space-before-blocks": ["error", "always"],
    "space-before-function-paren": ["error", {
      "anonymous": "always",
      "named": "always",
      "asyncArrow": "always"
    }],
    "space-in-parens": ["error", "never"],
    "space-infix-ops": ["error", {"int32Hint": false}],
    "spaced-comment": ["error", "always", {
      "line": {
        "markers": ["/"],
        "exceptions": ["-"]
      },
      "block": {
        "balanced": true,
        "markers": ["!"],
        "exceptions": ["*"]
      }
    }],
    "strict": ["error", "global"]
  }
};
