
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';

// --- Components Helpers ---

// Nút bấm chính (mô phỏng gradient)
const GradientButton = ({ title, onPress, style }) => (
    <TouchableOpacity style={[styles.gradientButton, style]} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);

// Nút bấm Google
const GoogleButton = ({ title, onPress }) => (
    <TouchableOpacity style={styles.googleButton} onPress={onPress}>
        {/* Placeholder for Google G icon */}
        <View style={styles.googleIconContainer}>
            <Text style={styles.googleIconText}>G</Text>
        </View>
        <Text style={styles.googleButtonText}>{title}</Text>
    </TouchableOpacity>
);

// Input tùy chỉnh
const CustomInput = ({ label, placeholder, secureTextEntry = false, value, onChangeText }) => (
    <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#888"
            secureTextEntry={secureTextEntry}
            value={value}
            onChangeText={onChangeText}
        />
    </View>
);

const LoginScreen = ({
    onNavigateToRegister, // Prop để chuyển hướng sang Register
}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Logo/Icon Area */}
                <View style={styles.logoContainer}>
                    <Text style={styles.logoIcon}>♫</Text>
                </View>
                <Text style={styles.logoText}>Vii Music</Text>
                
                {/* Header */}
                <Text style={styles.headerText}>Đăng nhập vào tài khoản của bạn</Text>

                {/* Form Inputs */}
                <CustomInput
                    label="Địa chỉ Email"
                    placeholder="spotify@gmail.com"
                    value={email}
                    onChangeText={setEmail}
                />
                <CustomInput
                    label="Mật khẩu"
                    placeholder="************"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                {/* Checkbox and Forgot Password */}
                <View style={styles.optionsRow}>
                    <TouchableOpacity 
                        style={styles.checkboxContainer} 
                        onPress={() => setRememberMe(!rememberMe)}
                    >
                        <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                            {rememberMe && <Text style={styles.checkboxCheck}>✓</Text>}
                        </View>
                        <Text style={styles.optionsText}>Nhớ tôi</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
                    </TouchableOpacity>
                </View>

                {/* Action Buttons */}
                <GradientButton title="Đăng nhập" onPress={() => console.log('Đăng nhập')} />

                {/* Separator */}
                <View style={styles.separatorContainer}>
                    <View style={styles.line} />
                    <Text style={styles.separatorText}>Hoặc tiếp tục với</Text>
                    <View style={styles.line} />
                </View>

                <GoogleButton title="Đăng nhập với Google" onPress={() => console.log('Google Sign In')} />

                {/* Footer Link */}
                <View style={styles.footerRow}>
                    <Text style={styles.footerText}>Chưa có tài khoản?</Text>
                    <TouchableOpacity onPress={onNavigateToRegister}>
                        <Text style={styles.footerLink}> Đăng ký</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#1E1E3F', // Màu nền tím đậm
    },
    container: {
        flexGrow: 1,
        paddingHorizontal: 30,
        paddingTop: 50,
        paddingBottom: 40,
        alignItems: 'center',
    },
    // --- Logo and Header ---
    logoContainer: {
        width: 70,
        height: 70,
        borderRadius: 15,
        backgroundColor: '#6C4EC7', // Màu tím cho icon
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
    },
    logoIcon: {
        fontSize: 36,
        color: '#fff',
        // Biểu tượng nốt nhạc
    },
    logoText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#E0B0FF', // Màu tím nhạt hơn cho tên ứng dụng
        marginBottom: 40,
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'left',
        width: '100%',
        marginBottom: 30,
    },
    // --- Input Fields ---
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 8,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    // --- Options Row ---
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 30,
        alignItems: 'center',
    },
    optionsText: {
        color: '#fff',
        fontSize: 14,
        marginLeft: 8,
    },
    forgotPassword: {
        color: '#00CFFF', // Màu xanh neon
        fontWeight: '600',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#00CFFF',
        borderColor: '#00CFFF',
    },
    checkboxCheck: {
        color: '#1E1E3F',
        fontSize: 12,
        fontWeight: 'bold',
    },
    // --- Buttons ---
    gradientButton: {
        width: '100%',
        height: 55,
        backgroundColor: '#00CFFF', // Màu xanh cho nút bấm chính
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
        // Thêm shadow để mô phỏng gradient/depth
        shadowColor: '#00CFFF',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    buttonText: {
        color: '#1E1E3F',
        fontSize: 18,
        fontWeight: 'bold',
    },
    // --- Separator ---
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 25,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    separatorText: {
        marginHorizontal: 15,
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
    },
    // --- Google Button ---
    googleButton: {
        flexDirection: 'row',
        width: '100%',
        height: 55,
        backgroundColor: '#fff', // Nền trắng cho nút Google
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
    },
    googleIconContainer: {
        width: 24,
        height: 24,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    googleIconText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4285F4', // Màu xanh Google
    },
    googleButtonText: {
        color: '#1E1E3F',
        fontSize: 16,
        fontWeight: '600',
    },
    // --- Footer ---
    footerRow: {
        flexDirection: 'row',
        marginTop: 'auto',
    },
    footerText: {
        color: '#fff',
        fontSize: 16,
    },
    footerLink: {
        color: '#00CFFF', // Màu xanh neon
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default LoginScreen;