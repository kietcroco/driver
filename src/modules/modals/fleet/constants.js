import { namespace as base } from '../constants';

export const namespace = `${base}/fleet`;

export const fleetTypes = {
    'vi': [
        {
            value: 'BUS',
            label: 'Xe bus'
        },
        {
            value: 'CAR',
            label: 'Xe hơi'
        },
        {
            value: 'TRUCK',
            label: 'Xe tải'
        },
        {
            value: 'BARGE',
            label: 'Xà lan'
        }
    ],
    'en': [
        {
            value: 'BUS',
            label: 'Bus'
        },
        {
            value: 'CAR',
            label: 'Car'
        },
        {
            value: 'TRUCK',
            label: 'Xe tải'
        },
        {
            value: 'BARGE',
            label: 'Xà lan'
        }
    ]
};
