package me.hellonayeon.backend.member.dao;

import me.hellonayeon.backend.member.domain.Member;
import me.hellonayeon.backend.member.dto.param.CreateMemberParam;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Mapper
@Repository
public interface MemberDao {

	Member findById(String id);

	Integer isExistUserId(String id);

	Integer createMember(CreateMemberParam param);

	Integer countMembers();

	List<Member> findMembers();

	Integer changeRole(@Param("id") String id,
	                   @Param("role") String role);

	Integer deleteMember(
			@Param("id") String id
	);

}
