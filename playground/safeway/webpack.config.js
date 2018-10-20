const path = require('path');

module.exports = {
    "entry": "./app.js",
    "output": {
        "path": path.resolve(__dirname, "./dist"),
        "filename": "bundle.js"
    },
    node: {
    fs: 'empty'
    },
    mode:"development",
    externals: ['net'],
    "module": {
        "rules": [
            {
                "test": /\.js$/,
                "exclude": /node_modules/,
                "use": {
                    "loader": "babel-loader",
                    "options": {
                        "presets": [
                            "env"
                        ]
                    }
                }
            },
            {
                "test": /\.css$/,
                "use": [
                    "style-loader",
                    "css-loader"
                ]
            }
        ]
    }
}
