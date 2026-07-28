package me.hellonayeon.backend.comment.controller;

import me.hellonayeon.backend.comment.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/comments")
public class AdminCommentController {

    private final CommentService commentService;

    public AdminCommentController(
            CommentService commentService
    ) {
        this.commentService = commentService;
    }

    @GetMapping("/count")
    public ResponseEntity<Integer> getCommentCount() {
        return ResponseEntity.ok(
                commentService.getTotalCommentCount()
        );
    }
}