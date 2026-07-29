package me.hellonayeon.backend.member.controller;

import java.util.List;

import me.hellonayeon.backend.bbs.service.BbsService;
import me.hellonayeon.backend.member.domain.Member;
import me.hellonayeon.backend.member.service.MemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/members")
public class AdminMemberController {

    private final MemberService service;

    public AdminMemberController(
            MemberService memberService

    ) {
        this.service = memberService;

    }

    @GetMapping("/count")
    public ResponseEntity<Integer> getMemberCount() {
        return ResponseEntity.ok(
                service.getMemberCount()
        );
    }

    @GetMapping
    public ResponseEntity<List<Member>> getMemberList() {
        return ResponseEntity.ok(
                service.getMemberList()
        );
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<Void> changeRole(
            @PathVariable String id
    ){

        service.changeRole(id);

        return ResponseEntity.ok().build();

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(
            @PathVariable String id
    ){

        service.deleteMember(id);

        return ResponseEntity.ok().build();

    }



}