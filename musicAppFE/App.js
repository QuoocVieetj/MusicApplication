import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
// Đảm bảo đường dẫn này đúng. Nếu hai file kia không cùng thư mục, bạn cần chỉnh lại.
import LoginScreen from "./screens/Auth/loginScreen"; 
import RegisterScreen from "./screens/Auth/registerScreen";

const App = () => {
    // Sử dụng state để quản lý màn hình hiện tại
    const [currentScreen, setCurrentScreen] = useState('Login'); // 'Login' hoặc 'Register'

    const navigateToRegister = () => setCurrentScreen('Register');
    const navigateToLogin = () => setCurrentScreen('Login');

    // Nếu màn hình vẫn không hiện, hãy thử thêm background color vào container để kiểm tra xem component App có được render không
    return (
        <View style={styles.container}>
            {currentScreen === 'Login' ? (
                <LoginScreen onNavigateToRegister={navigateToRegister} />
            ) : (
                <RegisterScreen onNavigateToLogin={navigateToLogin} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // Đã thêm màu nền để dễ dàng debug nếu app được load
        backgroundColor: '#1E1E3F', 
    }
});

export default App;