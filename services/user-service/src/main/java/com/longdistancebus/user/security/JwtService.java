package com.longdistancebus.user.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class JwtService {

    @Value("${jwt.issuer}")
    private String issuer;

    @Value("${jwt.access-token-ttl-minutes:30}")
    private long accessTtlMinutes;

    @Value("${jwt.private-key-pem:}")
    private String privateKeyPem;

    @Value("${jwt.public-key-pem:}")
    private String publicKeyPem;

    private PrivateKey privateKey;
    private PublicKey publicKey;

    private static byte[] parsePem(String pem, String begin, String end) {
        String stripped = pem.replace(begin, "")
                .replace(end, "")
                .replaceAll("\\s", "");
        return Base64.getDecoder().decode(stripped);
    }

    private synchronized void ensureKeys() {
        if (privateKey != null && publicKey != null) return;
        try {
            if (privateKeyPem == null || privateKeyPem.isBlank() ||
                    publicKeyPem == null || publicKeyPem.isBlank()) {
                throw new IllegalStateException("JWT keys are missing. Provide JWT_PRIVATE_PEM and JWT_PUBLIC_PEM.");
            }
            byte[] priv = parsePem(privateKeyPem, "-----BEGIN PRIVATE KEY-----", "-----END PRIVATE KEY-----");
            byte[] pub  = parsePem(publicKeyPem,  "-----BEGIN PUBLIC KEY-----",  "-----END PUBLIC KEY-----");
            KeyFactory kf = KeyFactory.getInstance("RSA");
            privateKey = kf.generatePrivate(new PKCS8EncodedKeySpec(priv));
            publicKey  = kf.generatePublic(new X509EncodedKeySpec(pub));
        } catch (Exception e) {
            throw new RuntimeException("Invalid RSA keys: " + e.getMessage(), e);
        }
    }

    public String generateAccessToken(Long userId, String subjectEmail, Collection<String> roles) {
        ensureKeys();
        Instant now = Instant.now();
        return Jwts.builder()
                .setIssuer(issuer)
                .setSubject(subjectEmail)
                .claim("user_id", userId)
                .claim("roles", roles)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plus(accessTtlMinutes, ChronoUnit.MINUTES)))
                .signWith(privateKey, SignatureAlgorithm.RS256)
                .compact();
    }

    public PublicKey getPublicKey() {
        ensureKeys();
        return publicKey;
    }
}
