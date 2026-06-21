// backend/src/main/java/com/schoollms/util/JwtUtil.java
package com.schoollms.util;

import com.schoollms.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;

public class JwtUtil {
    private static final String SECRET = System.getenv("JWT_SECRET") != null ? 
        System.getenv("JWT_SECRET") : "yourSecretKey";
    private static final long EXPIRATION_TIME = 864_000_000; // 10 days

    public String generateToken(User user) {
        return Jwts.builder()
            .setSubject(String.valueOf(user.getUserId()))
            .claim("role", user.getRole())
            .claim("fullname", user.getFullname())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
            .signWith(SignatureAlgorithm.HS256, SECRET)
            .compact();
    }
}