import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text, SafeAreaView, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity, RectButton } from 'react-native-gesture-handler';
import Constants from 'expo-constants';
import api from '../../services/api';
import * as MailComposer from 'expo-mail-composer';

interface Params {
    point_id: string;
}

interface Data {
    point: {
        id: number;
        name: string;
        email: string;
        whatsapp: string;
        city: string;
        uf: string;
    };

    items: {
        title: string;
    }[];
}

const Detail = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const routeParams = route.params as Params;
    const [data, setData] = useState<Data>({} as Data)

    const handleMailComposer = () => {
        MailComposer.composeAsync({
            subject: 'Interesse na coleta de residuos',
            recipients: [data.point.email]

        })
    }

    const handleWhatsapp = () => {
        Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}`)
    }

    const handleNavigationBack = () => {
        navigation.goBack();
    }

    useEffect(() => {
        api.get(`points/${routeParams.point_id}`).then(response => {
            setData(response.data);
        })

    }, []);


    if (!data.point) {
        return null;
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TouchableOpacity>
                    <Icon name="arrow-left" size={20} color="#34cb79" onPress={handleNavigationBack} />
                </TouchableOpacity>
                <Image source={{ uri: 'https://www.glutenfreebrasil.com/wp-content/uploads/2019/06/nrd-D6Tu_L3chLE-unsplash.jpg' }} style={styles.pointImage} />
                <Text style={styles.pointName}>{data.point.name}</Text>
                <Text style={styles.pointItems}>{data.items.map(item => item.title).join(', ')}</Text>
                <View style={styles.address}>
                    <Text style={styles.addressTitle}>Endereco</Text>
                    <Text style={styles.addressContent}>{data.point.city}, {data.point.uf}</Text>
                </View>
            </View>
            <View style={styles.footer}>
                <RectButton style={styles.button} onPress={handleWhatsapp}>
                    <FontAwesome name="whatsapp" size={20} color='#FFF' />
                    <Text style={styles.buttonText}>Whatsapp</Text>
                </RectButton>
                <RectButton style={styles.button} onPress={handleMailComposer}>
                    <Icon name="mail" size={20} color='#FFF' />
                    <Text style={styles.buttonText}>E-mail</Text>
                </RectButton>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        paddingTop: 20 + Constants.statusBarHeight,
    },

    pointImage: {
        width: '100%',
        height: 120,
        resizeMode: 'cover',
        borderRadius: 10,
        marginTop: 32,
    },

    pointName: {
        color: '#322153',
        fontSize: 28,
        fontFamily: 'Ubuntu_700Bold',
        marginTop: 24,
    },

    pointItems: {
        fontFamily: 'Roboto_400Regular',
        fontSize: 16,
        lineHeight: 24,
        marginTop: 8,
        color: '#6C6C80'
    },

    address: {
        marginTop: 32,
    },

    addressTitle: {
        color: '#322153',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    },

    addressContent: {
        fontFamily: 'Roboto_400Regular',
        lineHeight: 24,
        marginTop: 8,
        color: '#6C6C80'
    },

    footer: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: '#999',
        paddingVertical: 20,
        paddingHorizontal: 32,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    button: {
        width: '48%',
        backgroundColor: '#34CB79',
        borderRadius: 10,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        marginLeft: 8,
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Roboto_500Medium',
    },
});

export default Detail;