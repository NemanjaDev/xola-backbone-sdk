import { BaseModel } from '../BaseModel';
import $ from 'jquery';

export const Card = BaseModel.extend({
    defaults() {
        return {
            number: '',
            cvv: '',
            expiryMonth: '',
            expiryYear: '',
            billingState: '',
            billingPostcode: '',
            billingName: '',
            billingCity: '',
            billingAddress: '',
        };
    },

    validation() {
        return {
            billingName: {
                required: true,
            },
            number: {
                required: true,
                creditCard: true,
            },
            cvv: {
                required: !(this.has('swipe') && this.get('swipe')),
                cvv: true,
                pattern: 'number',
                length: this.cardType() === 'American Express' ? 4 : 3,
            },
            expiryMonth: {
                required: true,
                pattern: 'number',
            },
            expiryYear: {
                required: true,
                pattern: 'number',
            },
            billingPostcode: {
                required: true,
            },
        };
    },

    enableBillingValidation: function () {
        this.billingValidation = true;
    },

    disableBillingValidation: function () {
        this.billingValidation = false;
    },

    cardType() {
        let cardNumber = this.get('number');
        const p = {};
        p['51'] = 'Mastercard';
        p['52'] = 'Mastercard';
        p['53'] = 'Mastercard';
        p['54'] = 'Mastercard';
        p['55'] = 'Mastercard';
        p['34'] = 'American Express';
        p['37'] = 'American Express';
        p['4'] = 'VISA';
        p['6'] = 'Discover Card';
        p['35'] = 'JCB';
        p['30'] = 'Diners Club';
        p['36'] = 'Diners Club';
        p['38'] = 'Diners Club';

        if (cardNumber) {
            cardNumber = $.trim(cardNumber.toString());
            /* eslint-disable */
            for (const k in p) {
                if (cardNumber.indexOf(k) === 0) {
                    return p[k];
                }
            }
            /* eslint-enable */
        }

        return null;
    },
}, {
    COUNTRY_LIST: ["Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Bouvet Island", "Brazil", "British Antarctic Territory", "British Indian Ocean Territory", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Canton and Enderbury Islands", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos [Keeling] Islands", "Colombia", "Comoros", "Congo - Brazzaville", "Congo - Kinshasa", "Cook Islands", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Côte d’Ivoire", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Dronning Maud Land", "East Germany", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "French Southern Territories", "French Southern and Antarctic Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and McDonald Islands", "Honduras", "Hong Kong SAR China", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Johnston Island", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau SAR China", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Metropolitan France", "Mexico", "Micronesia", "Midway Islands", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar [Burma]", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "Neutral Zone", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "North Korea", "North Vietnam", "Northern Mariana Islands", "Norway", "Oman", "Pacific Islands Trust Territory", "Pakistan", "Palau", "Palestinian Territories", "Panama", "Panama Canal Zone", "Papua New Guinea", "Paraguay", "People's Democratic Republic of Yemen", "Peru", "Philippines", "Pitcairn Islands", "Poland", "Portugal", "Puerto Rico", "Qatar", "Romania", "Russia", "Rwanda", "Réunion", "Saint Barthélemy", "Saint Helena", "Saint Kitts and Nevis", "Saint Lucia", "Saint Martin", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Saudi Arabia", "Senegal", "Serbia", "Serbia and Montenegro", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "South Korea", "Spain", "Sri Lanka", "Sudan", "Suriname", "Svalbard and Jan Mayen", "Swaziland", "Sweden", "Switzerland", "Syria", "São Tomé and Príncipe", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "U.S. Minor Outlying Islands", "U.S. Miscellaneous Pacific Islands", "U.S. Virgin Islands", "Uganda", "Ukraine", "Union of Soviet Socialist Republics", "United Arab Emirates", "United Kingdom", "United States", "Unknown or Invalid Region", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Wake Island", "Wallis and Futuna", "Western Sahara", "Yemen", "Zambia", "Zimbabwe"]
});