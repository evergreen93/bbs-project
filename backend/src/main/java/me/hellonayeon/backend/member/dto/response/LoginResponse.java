package me.hellonayeon.backend.member.dto.response;

public class LoginResponse {

    private String jwt;
    private String id;
    private String role;

    public LoginResponse(
            String jwt,
            String id,
            String role
    ) {
        this.jwt = jwt;
        this.id = id;
        this.role = role;
    }

    public String getJwt() {
        return jwt;
    }

    public void setJwt(String jwt) {
        this.jwt = jwt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}