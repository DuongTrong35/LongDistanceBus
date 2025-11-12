package com.longdistancebus.user.security;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.util.Base64;

/**
 * Utility class to generate RSA key pair for JWT signing
 * Run this main method to generate keys and copy them to application.properties
 */
public class JwtKeyGenerator {
    
    public static void main(String[] args) {
        try {
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(2048); // 2048-bit key
            KeyPair keyPair = keyPairGenerator.generateKeyPair();
            
            PrivateKey privateKey = keyPair.getPrivate();
            PublicKey publicKey = keyPair.getPublic();
            
            // Convert to PEM format
            String privateKeyPem = convertToPEM(privateKey, true);
            String publicKeyPem = convertToPEM(publicKey, false);
            
            System.out.println("=== JWT RSA Keys Generated ===\n");
            System.out.println("Private Key (jwt.private-key-pem):");
            System.out.println(privateKeyPem);
            System.out.println("\nPublic Key (jwt.public-key-pem):");
            System.out.println(publicKeyPem);
            System.out.println("\n=== Copy these to application.properties ===");
            
        } catch (Exception e) {
            System.err.println("Error generating keys: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private static String convertToPEM(java.security.Key key, boolean isPrivate) {
        byte[] keyBytes = key.getEncoded();
        String base64Key = Base64.getEncoder().encodeToString(keyBytes);
        
        StringBuilder pem = new StringBuilder();
        if (isPrivate) {
            pem.append("-----BEGIN PRIVATE KEY-----\n");
        } else {
            pem.append("-----BEGIN PUBLIC KEY-----\n");
        }
        
        // Split into 64-character lines
        for (int i = 0; i < base64Key.length(); i += 64) {
            int end = Math.min(i + 64, base64Key.length());
            pem.append(base64Key.substring(i, end));
            pem.append("\n");
        }
        
        if (isPrivate) {
            pem.append("-----END PRIVATE KEY-----");
        } else {
            pem.append("-----END PUBLIC KEY-----");
        }
        
        return pem.toString();
    }
}


