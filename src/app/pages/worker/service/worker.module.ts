export interface Skill {
    idskill: string;
    type: string;
    description: string;
  }
  
  export interface Worker {
    id:string;
    first_name: string ;
    second_name: string ;
    email :string;
    address :string;
    birthday :Date ;
    phone_number: string ;
    skills?: Skill[]; // Optional skills array for display
  }
  
  export interface WorkerSkills {
    worker_id: string;
    skill_id: string;
  }