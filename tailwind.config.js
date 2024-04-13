/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/pages/*.ejs'],
    theme: {
        extend: {},
    },
    plugins: [require('@tailwindcss/forms')],
};
