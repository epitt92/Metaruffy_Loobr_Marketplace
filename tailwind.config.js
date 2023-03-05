module.exports = {
    darkMode: 'class',
    content: ['./src/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontSize: {
                '22px': '1.375rem',
                '2rem': '2rem',
                '4rem': '4rem',
                '5.5rem': '5.5rem',
                '28px': '1.75rem',
                '64px': '4rem',
                '40px': '2.5rem',
                '34px': '2.125rem',
                pre: '12px',
                sec: '10px'
            },
            colors: {
                themecolor: '#F1C94A',
                black1: '#090909',
                black2: '#29303A',
                primary: '#8B9199',
                red1: '#E41534',
                lightgray: '#777E90',
                darkgray: '#14141F',
                gray1: '#E6E8EC',
                blue1: '#1BA2DA ',
                blue2: '#1660CF ',
                green1: '#59C36A',
                green2: '#27AE60',
                gray2: '#96A2B5',
                gray3: '#D2D2D2',
                gray4: '#5A5A62',
                gray5: '#43434C',
                gray6: '#A1A1A5',
                gray7: '#818182',
                gray8: '#B8B8BC',
                slate1: '#3C3C52',

                //v2
                borderColor: '#727279',
                secondary: '#727279'
            },
            fontFamily: {
                'Proxima-Regular': 'Proxima-Nova-Regular',
                'Proxima-Light': 'Proxima-Nova-Light',
                'Proxima-SemiBold': 'Proxima-Nova-SemiBold',
                'Proxima-Bold': 'Proxima-Nova-Bold'
            },
            screens: {
                xs: { min: '300px', max: '500px' },
                xs1: { min: '430px', max: '568px' },
                xs2: { min: '300px', max: '429px' },
                xs3: { min: '320px', max: '410px' },
                xs4: { min: '320px', max: '370px' },
                xss: { min: '290px', max: '500px' },
                1760: { min: '1478px', max: '1760px' },
                1480: { max: '1480px' }
            },
            lineHeight: {
                normal: '1.4'
            }
        }
    },
    plugins: []
};
