import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, ImageBackground, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import ibge from '../../services/ibge';

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

interface FormatPickerSelect {
    label: string;
    value: string;
}

const Home: React.FC = () => {
    const [uf, setUF] = useState<FormatPickerSelect[]>([]);
    const [city, setCity] = useState<FormatPickerSelect[]>([]);
    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');
    const navigation = useNavigation();
    const handleNavigation = () => {
        navigation.navigate('Points', {
            uf: selectedUf,
            city: selectedUf
        });
    }

    useEffect(() => {
        async function loadUF() {
            const response = await ibge.get<IBGEUFResponse[]>('localidades/estados');
            const initials = response.data.map(uf => {
                return {
                    label: uf.sigla,
                    value: uf.sigla
                };
            });
            setUF(initials)
        }
        loadUF();
    }, []);

    useEffect(() => {
        async function loadCity() {
            if (selectedUf === '0') return;
            const response = await ibge.get<IBGECityResponse[]>(`localidades/estados/${selectedUf}/municipios`);
            const cityNames = response.data.map(city => {
                return {
                    label: city.nome,
                    value: city.nome
                };
            });

            setCity(cityNames);
        }
        loadCity();
    }, [selectedUf]);
    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ImageBackground
                source={require('../../assets/home-background.png')}
                style={styles.container}
                imageStyle={{ width: 274, height: 368 }}>
                <View style={styles.main}>
                    <Image source={require('../../assets/logo.png')} />
                    <View>
                        <Text style={styles.title}>Seu marketplace de coleta de residuos.</Text>
                        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
                    </View>

                </View>
                <View style={styles.footer}>
                    {uf.length > 0 && (
                        <RNPickerSelect placeholder={{
                            label: "Selecione uma UF",
                            value: '0',
                        }} style={{ ...pickerSelectStyles }} onValueChange={value => {
                            setSelectedUf(String(value))
                            setSelectedCity('0');

                        }}
                            items={uf} />
                    )}

                    {selectedUf !== '0' && (
                        <RNPickerSelect
                            placeholder={{
                                label: 'Selecione uma cidade',
                                value: '0',
                            }}
                            style={{ ...pickerSelectStyles }}
                            onValueChange={(value) => setSelectedCity(String(value))}
                            items={city}
                        />
                    )}

                    <RectButton style={styles.button} onPress={handleNavigation} >
                        <View style={styles.buttonIcon}>
                            <Text>
                                <Icon name="arrow-right" color="#FFF" size={24}></Icon>
                            </Text>
                        </View>
                        <Text style={styles.buttonText}>
                            Entrar
                    </Text>
                    </RectButton>

                </View>
            </ImageBackground>
        </KeyboardAvoidingView>

    );
};


const pickerSelectStyles = StyleSheet.create({
    viewContainer: {
        height: 60,
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },

    inputAndroid: {
        color: '#322153'
    },

    inputIOS: {
        color: '#322153'
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
    },

    main: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 72,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },

    footer: {},
    select: {},

    input: {
        height: 60,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
        paddingHorizontal: 24,
        fontSize: 16
    },

    button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
    },

    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    }
});

export default Home;