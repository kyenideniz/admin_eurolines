interface GraphData {
    name: string;
    total: number;
}

export const getGraphRevenue = async (storeId: string) => {
    const paidOrders: any = [];

    const monthlyRevenue: { [key: number]: number } = {};

    for (const order of paidOrders) {
        const month = order.createdAt.getMonth();
        let revenueForOrder = 0;

        for (const item of order.orderItems) {
            revenueForOrder += Number(item.product.price);
        }

        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
    }

    const graphData: GraphData[] = [
        { name: 'Jan', total: 52 },
        { name: 'Feb', total: 44 },
        { name: 'Mar', total: 58 },
        { name: 'Apr', total: 55 },
        { name: 'May', total: 89 },
        { name: 'Jun', total: 81 },
        { name: 'Jul', total: 84 },
        { name: 'Aug', total: 74 },
        { name: 'Sep', total: 78 },
        { name: 'Oct', total: 74 },
        { name: 'Nov', total: 90 },
        { name: 'Dec', total: 92 }
    ];

    for (const month in monthlyRevenue) {
        graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
    }

    return graphData;
}