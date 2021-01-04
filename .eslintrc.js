module.exports = {
    "root": true,
    "env": {
        "node": true,
        "es6": true,
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module",
    },
    "ignorePatterns": ["packages/ui", "packages/cdk"],
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
