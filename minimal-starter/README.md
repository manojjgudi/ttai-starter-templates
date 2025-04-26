# Personality Types Explorer

A minimal web application that provides information about different personality types and allows users to interact with a ToughTongue AI assistant to discover their own personality type.

## Features

- Clean, responsive UI built with Preact (via CDN)
- Information about different personality types
- Integration with ToughTongue AI for personality assessment

## Setup and Usage

This is a client-side only application that can be served with any static file server.

1. Replace the `SCENARIO_ID` in `app.js` with your actual ToughTongue AI scenario ID
2. Host the files on any web server or open `index.html` directly in a browser

### Running Locally

You can run this application on localhost using several methods:

#### Method 1: Using Python's built-in HTTP server

If you have Python installed:

```
cd minimal-starter
python -m http.server
```

Then visit http://localhost:8000 in your browser.

#### Method 2: Using Node.js tools

If you have Node.js installed:

```
cd minimal-starter
npx http-server
```

Or install a global server:

```
npm install -g serve
cd minimal-starter
serve
```

#### Method 3: Using VS Code's Live Server extension

If you're using VS Code, install the "Live Server" extension, right-click on index.html, and select "Open with Live Server".

#### Method 4: Simply open the file

Since this is a pure frontend application with no backend requirements, you can also just open the index.html file directly in your browser:

```
open minimal-starter/index.html  # On macOS
```

### ToughTongue AI Integration

The application uses the ToughTongue AI embedding to provide a personality assessment. To set this up:

1. Create a scenario in the ToughTongue AI platform
2. Replace `SCENARIO_ID` in the `src` attribute of the iframe in `app.js` with your scenario ID
3. Optionally customize the iframe appearance with URL parameters as documented in the ToughTongue AI developer guide

## Customization

- Color scheme: Edit the CSS variables in the `:root` selector in `styles.css`
- Personality types: Modify the `personalityTypes` array in `app.js`
- Layout: Adjust the grid and container styles in `styles.css`

## Browser Support

This application works best in modern browsers that support ES6+ features. Chrome is recommended for the best experience with ToughTongue AI integration, as there may be recording issues in Safari.

## License

MIT
