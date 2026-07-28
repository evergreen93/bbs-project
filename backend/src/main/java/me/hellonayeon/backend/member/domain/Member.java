package me.hellonayeon.backend.member.domain;

public class Member {

	private String id;
	private String pwd;
	private String name;
	private String email;
	private String role;
	private String enabled;

	public Member() {
	}

	public Member(
			String id,
			String pwd,
			String name,
			String email,
			String role,
			String enabled
	) {
		this.id = id;
		this.pwd = pwd;
		this.name = name;
		this.email = email;
		this.role = role;
		this.enabled = enabled;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getPwd() {
		return pwd;
	}

	public void setPwd(String pwd) {
		this.pwd = pwd;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	@Override
	public String toString() {
		return "Member{" +
				"id='" + id + '\'' +
				", pwd='" + pwd + '\'' +
				", name='" + name + '\'' +
				", email='" + email + '\'' +
				", role='" + role + '\'' +
				", enabled='" + enabled + '\'' +
				'}';
	}

	public String getEnabled() {
		return enabled;
	}

	public void setEnabled(String enabled) {
		this.enabled = enabled;
	}

}