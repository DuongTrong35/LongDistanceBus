package com.longdistancebus.user.api;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.longdistancebus.user.security.JwtService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigInteger;
import java.security.interfaces.RSAPublicKey;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@RestController
public class JwksController {
    private final JwtService jwtService;

    public JwksController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    static class Jwk {
        public String kty = "RSA";
        public String alg = "RS256";
        public String use = "sig";
        public String kid = "ldbus-key-1"; // tạm đặt cố định
        public String n; // modulus
        public String e; // exponent
        public Jwk(String n, String e) { this.n = n; this.e = e; }
    }

    @GetMapping("/.well-known/jwks.json")
    public Map<String, List<Jwk>> jwks() {
        try {
            RSAPublicKey pk = (RSAPublicKey) jwtService.getPublicKey();
            String n = base64Url(pk.getModulus());
            String e = base64Url(pk.getPublicExponent());
            return Map.of("keys", List.of(new Jwk(n, e)));
        } catch (RuntimeException e) {
            // Return empty keys array if JWT keys are not configured
            // This allows the service to start without JWT keys for registration/login
            // Other services can still call this endpoint without error
            return Map.of("keys", List.<Jwk>of());
        }
    }

    private String base64Url(BigInteger v) {
        byte[] bytes = v.toByteArray();
        String s = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        // một số JVM thêm byte 0x00 đầu cho số dương -> chuẩn hoá
        if (s.startsWith("AA")) {
            while (s.startsWith("AA")) s = s.substring(2);
        }
        return s;
    }
}
