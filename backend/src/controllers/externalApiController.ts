import { Request, Response } from 'express';
import axios from 'axios';

export const getNseData = async (req: Request, res: Response): Promise<void> => {
    try {
        // Since we don't have a Mansa Markets API key, we'll provide a high-quality 
        // simulated response that follows their schema. 
        // In a real production environment, the user would provide an API_KEY.
        const simulatedNse = [
            { symbol: 'SCOM', name: 'Safaricom PLC', price: 42.15, change: 0.5, change_percent: 1.2, volume: '1.2M' },
            { symbol: 'EQTY', name: 'Equity Group Holdings', price: 38.50, change: -0.2, change_percent: -0.5, volume: '800K' },
            { symbol: 'KCB', name: 'KCB Group', price: 35.80, change: 0.85, change_percent: 2.4, volume: '1.1M' },
            { symbol: 'COOP', name: 'Co-operative Bank', price: 12.45, change: 0.0, change_percent: 0.0, volume: '400K' },
            { symbol: 'EABL', name: 'East African Breweries', price: 150.25, change: 2.50, change_percent: 1.7, volume: '200K' },
            { symbol: 'BAT', name: 'British American Tobacco', price: 410.00, change: -5.00, change_percent: -1.2, volume: '50K' },
            { symbol: 'ABSA', name: 'Absa Bank Kenya', price: 11.80, change: 0.15, change_percent: 1.3, volume: '600K' },
            { symbol: 'NCBA', name: 'NCBA Group', price: 39.20, change: 0.40, change_percent: 1.0, volume: '300K' },
        ];
        res.json(simulatedNse);
    } catch (err) {
        console.error('Error fetching NSE data:', err);
        res.status(500).json({ message: 'Failed to fetch NSE data' });
    }
};

export const getCbkExchangeRates = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await axios.get('http://www.floatrates.com/daily/kes.json');
        res.json(response.data);
    } catch (err) {
        console.error('Error fetching CBK data:', err);
        res.status(500).json({ message: 'Failed to fetch CBK exchange rates' });
    }
};

export const getWorldBankData = async (req: Request, res: Response): Promise<void> => {
    const { indicator = 'NY.GDP.MKTP.CD' } = req.query; // Default to GDP
    try {
        const response = await axios.get(`https://api.worldbank.org/v2/country/KE/indicator/${indicator}?format=json`);
        // World Bank API returns [metadata, data]
        res.json(response.data[1]);
    } catch (err) {
        console.error('Error fetching World Bank data:', err);
        res.status(500).json({ message: 'Failed to fetch World Bank economic data' });
    }
};

export const getMarketIndices = async (req: Request, res: Response): Promise<void> => {
    try {
        // Simulated Market Indices for NSE
        const indices = [
            { name: 'NSE 20 Share Index', value: 1542.30, change: 12.45, change_percent: 0.81 },
            { name: 'NSE 25 Share Index', value: 2315.10, change: -5.20, change_percent: -0.22 },
            { name: 'NASI (All Share)', value: 102.45, change: 1.15, change_percent: 1.13 },
        ];
        res.json(indices);
    } catch (err) {
        console.error('Error fetching market indices:', err);
        res.status(500).json({ message: 'Failed to fetch market indices' });
    }
};
