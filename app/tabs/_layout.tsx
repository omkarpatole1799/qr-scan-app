import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import AntDesign from '@expo/vector-icons/AntDesign';

const tabsLayout = () => {
    return (
        <>
            <Tabs>
                <Tabs.Screen
                    name="scan"
                    options={{
                        title: 'Search Candiate',
                        tabBarIcon: () => (
                            <Ionicons name="qr-code-outline" size={20} color="black" />
                        ),
                    }}
                />
            
             <Tabs.Screen
                    name="interview-attendance-dashboard"
                    options={{
                        title: 'Interview Dashboard',
                        tabBarIcon: () => <AntDesign name="home" size={20} color="black" />,
                        headerShown: false,
                    }}
                />
            
            
                <Tabs.Screen
                    name="count"
                    options={{
                        title: 'Attendance Count',
                        tabBarIcon: () => <EvilIcons name="chart" size={20} color="black" />,
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Profile',
                        tabBarIcon: () => <AntDesign name="home" size={20} color="black" />,
                        headerShown: false,
                    }}
                />
            </Tabs>



        </>
    );
};

export default tabsLayout;
