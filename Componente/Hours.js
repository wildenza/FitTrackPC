import React, { useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { getDatabase, ref, get } from 'firebase/database';
import { database } from './firebaseConfig';

const screenWidth = Dimensions.get("window").width;

const HoursChart = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const databaseRef = getDatabase();
                const snapshot = await get(ref(databaseRef, 'users'));
                const usersData = snapshot.val();

                const hourCounts = {};

                Object.values(usersData).forEach(userData => {
                    if (userData.Checks) {
                        Object.values(userData.Checks).forEach(check => {
                            if (check['Check-in']) {
                                const timestamp = check['Check-in'];
                                const hour = timestamp.split(',')[1].split(':')[0];
                                hourCounts[hour] = (hourCounts[hour] || 0) + 1;
                            } else if (check['Check-out']) {
                                const timestamp = check['Check-out'];
                                const hour = timestamp.split(',')[1].split(':')[0];
                                hourCounts[hour] = (hourCounts[hour] || 0) - 1;
                            }
                        });
                    }
                });

                const labels = Object.keys(hourCounts).sort();
                const data = labels.map(hour => hourCounts[hour] || 0);

                setChartData({ labels, datasets: [{ data }] });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {chartData && (
                <BarChart
                    data={chartData}
                    width={screenWidth}
                    height={220}
                    yAxisLabel={'\n\n\n\n\n\n'}
                    yAxisSuffix=""
                    yAxisInterval={1}
                    fromZero={true}
                    chartConfig={{
                        backgroundGradientFrom: '#f0f0f0',
                        backgroundGradientTo: '#f0f0f0',
                        fillShadowGradient: '#fff',
                        fillShadowGradientOpacity: 0.5,
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(75, 0, 130, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(75, 0, 130, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        barPercentage: 0.8, // Adjust this value to change the width of the bars
                        categoryPercentage: 0.8 // Adjust this value to change the spacing between categories
                    }}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />
            )}
        </View>
    );
};

export default HoursChart;
