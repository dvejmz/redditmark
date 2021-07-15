module.exports = {
    "root": true,
    "env": {
        "node": true,
        "es6": true,
        "jest/globals": true
    },
    "plugins": ["jest"],
    "parserOptions": {
        "ecmaVersion": 2020,
        "sourceType": "module",
    },
    "rules": {
        "semi": "error",
        "import/no-unresolved": [
            2,
            {
                "commonjs": true
            }
        ]
    },
    "extends": [
        "eslint:recommended",
        "plugin:import/errors",
        "plugin:import/warnings"
    ]
};
