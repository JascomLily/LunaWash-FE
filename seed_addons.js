const services = [
    {
        serviceName: 'Thay D?u / Nh?t',
        description: 'Thay nh?t ð?ng cõ cao c?p, ki?m tra l?p và làm s?ch l?c nh?t.',
        serviceType: 'AddOn',
        iconName: 'oil_barrel',
        isPopular: true,
        serviceFeatures: [],
        prices: [
            { vehicleTypeId: 'VT-OTO-2C', price: 400000, durationMinutes: 30, pointsRewarded: 40 },
            { vehicleTypeId: 'VT-OTO-4C', price: 450000, durationMinutes: 30, pointsRewarded: 45 },
            { vehicleTypeId: 'VT-OTO-7C', price: 600000, durationMinutes: 40, pointsRewarded: 60 },
            { vehicleTypeId: 'VT-OTO-SUV', price: 650000, durationMinutes: 40, pointsRewarded: 65 },
            { vehicleTypeId: 'VT-OTO-BT', price: 700000, durationMinutes: 45, pointsRewarded: 70 }
        ]
    },
    {
        serviceName: 'V? Sinh Ð?m Gh? Da',
        description: 'S? d?ng dung d?ch chuyên d?ng làm s?ch sâu và dý?ng m?m gh? da.',
        serviceType: 'AddOn',
        iconName: 'airline_seat_recline_normal',
        isPopular: false,
        serviceFeatures: [],
        prices: [
            { vehicleTypeId: 'VT-OTO-2C', price: 300000, durationMinutes: 40, pointsRewarded: 30 },
            { vehicleTypeId: 'VT-OTO-4C', price: 500000, durationMinutes: 60, pointsRewarded: 50 },
            { vehicleTypeId: 'VT-OTO-7C', price: 800000, durationMinutes: 80, pointsRewarded: 80 },
            { vehicleTypeId: 'VT-OTO-SUV', price: 800000, durationMinutes: 80, pointsRewarded: 80 },
            { vehicleTypeId: 'VT-OTO-BT', price: 600000, durationMinutes: 60, pointsRewarded: 60 }
        ]
    },
    {
        serviceName: 'Ph? Nano Kính',
        description: 'Ph? Nano kính lái và kính sý?n, hi?u ?ng lá sen ch?ng bám ný?c mýa.',
        serviceType: 'AddOn',
        iconName: 'blur_on',
        isPopular: true,
        serviceFeatures: [],
        prices: [
            { vehicleTypeId: 'VT-OTO-2C', price: 350000, durationMinutes: 30, pointsRewarded: 35 },
            { vehicleTypeId: 'VT-OTO-4C', price: 350000, durationMinutes: 30, pointsRewarded: 35 },
            { vehicleTypeId: 'VT-OTO-7C', price: 450000, durationMinutes: 40, pointsRewarded: 45 },
            { vehicleTypeId: 'VT-OTO-SUV', price: 450000, durationMinutes: 40, pointsRewarded: 45 },
            { vehicleTypeId: 'VT-OTO-BT', price: 450000, durationMinutes: 40, pointsRewarded: 45 }
        ]
    },
    {
        serviceName: 'T?y ? M?c Kính',
        description: 'T?y s?ch c?n canxi, ? m?c lâu ngày trên kính xe, tr? l?i s? trong su?t.',
        serviceType: 'AddOn',
        iconName: 'cleaning_services',
        isPopular: false,
        serviceFeatures: [],
        prices: [
            { vehicleTypeId: 'VT-OTO-2C', price: 250000, durationMinutes: 30, pointsRewarded: 25 },
            { vehicleTypeId: 'VT-OTO-4C', price: 250000, durationMinutes: 30, pointsRewarded: 25 },
            { vehicleTypeId: 'VT-OTO-7C', price: 350000, durationMinutes: 40, pointsRewarded: 35 },
            { vehicleTypeId: 'VT-OTO-SUV', price: 350000, durationMinutes: 40, pointsRewarded: 35 },
            { vehicleTypeId: 'VT-OTO-BT', price: 350000, durationMinutes: 40, pointsRewarded: 35 }
        ]
    }
];

async function seed() {
    for (const svc of services) {
        const payload = {
            serviceName: svc.serviceName,
            description: svc.description,
            serviceType: svc.serviceType,
            iconName: svc.iconName,
            isPopular: svc.isPopular,
            serviceFeatures: svc.serviceFeatures
        };

        const res = await fetch('http://localhost:5010/api/Services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            console.error('Failed to create', svc.serviceName, await res.text());
            continue;
        }

        const data = await res.json();
        console.log('Created:', data.serviceName, data.id);

        for (const price of svc.prices) {
            const priceRes = await fetch(`http://localhost:5010/api/Services/${data.id}/prices`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(price)
            });
            if (!priceRes.ok) {
                console.error('Failed price for', svc.serviceName, await priceRes.text());
            }
        }
    }
    console.log('Done!');
}

seed();
