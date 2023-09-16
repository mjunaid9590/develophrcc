 const JOB_STATUS = {
    PENDING: 'pending',
    INTERVIEW: 'interview',
    DECLINED: 'declined',
  };
  
   const JOB_TYPE = {
    FULL_TIME: 'full-time',
    PART_TIME: 'part-time',
    INTERNSHIP: 'internship',
  };
  
   const JOB_SORT_BY = {
    NEWEST_FIRST: 'newest',
    OLDEST_FIRST: 'oldest',
    ASCENDING: 'a-z',
    DESCENDING: 'z-a',
  };
  
   const STATUS={
    ACTIVE:"active",
    NONE:"none"
  }
   const SELECTED={
    NONE:"none",
    DONE:"done",
    PENDING:"pending"
  }
   const REJECTED={
    NONE:"none",
    DONE:"done",
    PENDING:"pending"
  }
   const VISA_STATUS={
    CANCELED:"canceled",
    VISITED:"visited"
  }
   const PAYMENT={
    OK:"ok",
    NONE:"none"
  }

  module.exports = {JOB_STATUS, JOB_TYPE, JOB_SORT_BY, STATUS, SELECTED, REJECTED, VISA_STATUS, PAYMENT}
  
  