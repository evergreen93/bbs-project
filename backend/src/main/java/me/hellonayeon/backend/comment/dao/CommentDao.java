package me.hellonayeon.backend.comment.dao;

import java.util.List;
import me.hellonayeon.backend.comment.domain.Comment;
import me.hellonayeon.backend.comment.dto.param.CommentListParam;
import me.hellonayeon.backend.comment.dto.param.CreateCommentParam;
import me.hellonayeon.backend.comment.dto.param.UpdateCommentParam;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface CommentDao {

    List<Comment> getCommentPageList(CommentListParam param);

    Integer getCommentCount(Integer seq); // 게시글별 댓글 수

    Integer getTotalCommentCount(); // 전체 댓글 수

    void createComment(CreateCommentParam param);
    Integer deleteComment(Integer seq);

    Integer deleteCommentsByBbsSeq(
            @Param("bbsSeq") Integer bbsSeq
    );
    Comment getCommentBySeq(Integer seq);
    Integer updateComment(UpdateCommentParam param);

    Integer deleteCommentsByBbsRef(Integer seq);

}
