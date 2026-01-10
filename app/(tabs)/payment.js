import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { addToPremium, getPremiumStatus } from '../../src/services/premiumUsers';
import { useEffect } from 'react';

const SCREEN_WIDTH = Dimensions.get('window').width;

const PlanCard = ({ title, price, features, color, recommended, onPress }) => (
    <View style={[styles.planCard, { borderColor: color }]}>
        {recommended && (
            <View style={[styles.recommendedBadge, { backgroundColor: color }]}>
                <Text style={styles.recommendedText}>Free for 1 month</Text>
            </View>
        )}
        <View style={styles.planHeader}>
            <Text style={styles.planTitle}>{title}</Text>
            <View style={styles.priceContainer}>
                <Text style={styles.priceAmount}>{price}</Text>
                <Text style={styles.pricePeriod}>/month</Text>
            </View>
            <Text style={styles.planSubtext}>Cancel anytime.</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.featuresList}>
            {features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                    <Ionicons name="checkmark" size={20} color={color} />
                    <Text style={styles.featureText}>{feature}</Text>
                </View>
            ))}
        </View>
        <TouchableOpacity style={[styles.planButton, { backgroundColor: color }]} onPress={onPress}>
            <Text style={styles.planButtonText}>START NOW</Text>
        </TouchableOpacity>
        <Text style={styles.termsText}>Terms and conditions apply.</Text>
    </View>
);

export default function PaymentScreen() {
    const [currentPlan, setCurrentPlan] = useState('Free');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            const status = await getPremiumStatus();
            if (status) setCurrentPlan(status);
        }
        checkStatus();
    }, []);

    const handleSub = async (planTitle) => {
        setLoading(true);
        const success = await addToPremium(planTitle);
        setLoading(false);
        if (success) {
            Alert.alert("Success", "Congrats you have been added to premium ");
            setCurrentPlan(planTitle);
        }

        else
            Alert.alert("Error", "User not Added");
    }




    const features = [
        "Ad-free music listening",
        "Download to listen offline",
        "Unlimited skips",
        "High audio quality",
        "Listen with friends in real-time"
    ];


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Premium Plans</Text>
                </View>


                <View style={styles.heroSection}>
                    <Text style={styles.heroTitle}>Try Premium free for 1 month</Text>
                    <Text style={styles.heroSubtitle}>
                        Listen without limits on your phone, speaker, and other devices.
                    </Text>
                </View>


                <View style={styles.currentPlanContainer}>
                    <Text style={styles.currentPlanLabel}>Current Plan:</Text>
                    <View style={styles.currentPlanBadge}>
                        <Text style={styles.currentPlanText}>{currentPlan}</Text>
                    </View>
                </View>


                <View style={styles.featuresContainer}>
                    <Text style={styles.sectionTitle}>Why join Premium?</Text>
                    {features.map((item, index) => (
                        <View key={index} style={styles.mainFeatureItem}>
                            <Ionicons name="checkmark-circle" size={24} color="#1DB954" />
                            <Text style={styles.mainFeatureText}>{item}</Text>
                        </View>
                    ))}
                </View>


                <View style={styles.plansContainer}>
                    <Text style={styles.sectionTitle}>Pick your Premium</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsScroll}>
                        <PlanCard
                            title="Personal"
                            price="$10.99"
                            color="#FFD2D7"
                            features={["1 Premium account", "Cancel anytime", "15 hours/month of listening time from our audiobooks subscriber catalog"]}
                            recommended={true}
                            onPress={() => handleSub("Personal")}
                        />
                        <PlanCard
                            title="Duo"
                            price="$14.99"
                            color="#C4B1D4"
                            features={["2 Premium accounts", "Cancel anytime", "15 hours/month of listening time from our audiobooks subscriber catalog"]}
                            onPress={() => handleSub("Duo")}
                        />
                        <PlanCard
                            title="Family"
                            price="$16.99"
                            color="#A5C4F7"
                            features={["Up to 6 Premium accounts", "Block explicit music", "Access to Spotify Kids"]}
                            onPress={() => handleSub("Family")}

                        />
                        <PlanCard
                            title="Student"
                            price="$5.99"
                            color="#E5C596"
                            features={["1 verified Premium account", "Discount for eligible students", "Access to Hulu"]}
                            onPress={() => handleSub("Student")}

                        />
                    </ScrollView>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Musicaly details and other legal information can be found in our terms of use.</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    heroSection: {
        padding: 20,
        alignItems: 'flex-start',
    },
    heroTitle: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        lineHeight: 34,
    },
    heroSubtitle: {
        color: '#B3B3B3', // Light grey
        fontSize: 16,
        lineHeight: 22,
    },
    currentPlanContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#242424', // Card background
        marginHorizontal: 20,
        padding: 15,
        borderRadius: 8,
        marginBottom: 30,
    },
    currentPlanLabel: {
        color: '#B3B3B3',
        fontSize: 14,
    },
    currentPlanBadge: {

    },
    currentPlanText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    featuresContainer: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    sectionTitle: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    mainFeatureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    mainFeatureText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 15,
    },
    plansContainer: {
        marginBottom: 20,
    },
    cardsScroll: {
        paddingHorizontal: 20,
        gap: 15,
    },
    planCard: {
        backgroundColor: '#242424',
        borderRadius: 10,
        padding: 20,
        width: SCREEN_WIDTH * 0.8, // 80% of screen width
        minHeight: 350,
        borderTopWidth: 4,
        position: 'relative',
        marginRight: 15,
    },
    recommendedBadge: {
        position: 'absolute',
        top: -16,
        left: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    recommendedText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 12,
    },
    planHeader: {
        marginBottom: 20,
        marginTop: 10,
    },
    planTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    priceAmount: {
        color: 'white',
        fontSize: 26,
        fontWeight: 'bold',
    },
    pricePeriod: {
        color: '#B3B3B3',
        fontSize: 14,
        marginLeft: 5,
    },
    planSubtext: {
        color: '#B3B3B3',
        marginTop: 5,
    },
    separator: {
        height: 1,
        backgroundColor: '#333',
        marginBottom: 20,
    },
    featuresList: {
        flex: 1, // Take available space
        marginBottom: 20,
    },
    featureItem: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'flex-start',
    },
    featureText: {
        color: '#B3B3B3',
        marginLeft: 10,
        fontSize: 14,
        flex: 1,
    },
    planButton: {
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 10,
    },
    planButtonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 0.5,
    },
    termsText: {
        color: '#B3B3B3',
        fontSize: 10,
        textAlign: 'center',
        marginTop: 15,
    },
    footer: {
        padding: 20,
        alignItems: 'center',
    },
    footerText: {
        color: '#535353',
        fontSize: 12,
        textAlign: 'center',
    }

});
