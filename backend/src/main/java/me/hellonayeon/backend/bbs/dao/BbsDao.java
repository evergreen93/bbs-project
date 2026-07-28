package me.hellonayeon.backend.bbs.dao;

import java.util.List;
import me.hellonayeon.backend.bbs.domain.Bbs;
import me.hellonayeon.backend.bbs.dto.param.BbsCountParam;
import me.hellonayeon.backend.bbs.dto.param.BbsListParam;
import me.hellonayeon.backend.bbs.dto.param.CreateBbsAnswerParam;
import me.hellonayeon.backend.bbs.dto.param.CreateBbsParam;
import me.hellonayeon.backend.bbs.dto.param.CreateReadCountParam;
import me.hellonayeon.backend.bbs.dto.param.UpdateBbsParam;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;



@Mapper
@Repository
public interface BbsDao {

	Integer getBoardCount();

	List<Bbs> getBbsSearchPageList(BbsListParam param);
	Integer getBbsCount(BbsCountParam param);

	Bbs getBbs(Integer seq);
	Integer createBbsReadCountHistory(CreateReadCountParam param);
	Integer increaseBbsReadCount(Integer seq);

	void createBbs(CreateBbsParam param);

	Integer updateBbsStep(Integer parentSeq);
	Integer getBbsAnswerCount(Integer parentSeq);
	void createBbsAnswer(CreateBbsAnswerParam param);

	Integer updateBbs(UpdateBbsParam param);

	Integer deleteBbs(Integer seq);

	Integer deleteReadHistoryByBbsRef(Integer seq);

	Integer deleteBbsGroupByAdmin(Integer seq);

	List<Bbs> findBoardsForAdmin();


}
