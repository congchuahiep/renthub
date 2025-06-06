import React from "react";
import { View } from "react-native";
import { TextInput, HelperText } from "react-native-paper";

const InputField = ({
	label = "Hả",
	value = null,
	onChangeText = null,
	secureTextEntry = false,
	icon = null,
	error = null,
	style = null,
    keyboardType = "default",
    multiline = false,
	...props
}) => (
	<View style={{ marginBottom: 4 }}>
		<TextInput
			label={label}
			placeholder={label}
			value={value}
			onChangeText={onChangeText}
			secureTextEntry={secureTextEntry}
			right={icon ? <TextInput.Icon icon={icon} /> : null}
			mode="outlined"
			error={!!error}
			style={[style, { minHeight: multiline && 160}]}
			autoCapitalize="none"
            keyboardType={keyboardType}
            multiline={multiline}
			{...props}
		/>
		{error && (
			<HelperText type="error" visible={!!error}>
				{error}
			</HelperText>
		)}
	</View>
);

export default InputField;
