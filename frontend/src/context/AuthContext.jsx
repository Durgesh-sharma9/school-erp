import React, { createContext, useContext, useState, useEffect } from 'react';
import { tenantStore } from '../services/tenantStore';

const AuthContext = createContext(null);

export const DEMO_USERS = {
  // ==================== SUPER ADMIN ====================
  SUPER_ADMIN: {
    id: 'usr_superadmin',
    username: 'superadmin',
    name: 'Chief SuperAdmin',
    role: 'SUPER_ADMIN',
    privilegeId: 1,
    schoolId: null, // Cross-tenant global overview
    schoolName: 'UAB Group HQ (Multi-Campus)',
    schoolCode: 'HQ-GLOBAL',
    sessionId: '2026-2027',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    email: 'superadmin@uabinfosol.com'
  },

  // ==================== SCHOOL A: J D INTERNATIONAL SCHOOL ====================
  ADMIN: {
    id: 'usr_admin_sch_a',
    username: '8947919195',
    name: 'Admin (J D International)',
    role: 'ADMIN',
    privilegeId: 2,
    schoolId: 'sch_jd_intl',
    schoolName: 'J D International School',
    schoolCode: '10964',
    sessionId: '2026-2027',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    email: '10964@cbseshiksha.in'
  },
  STAFF: {
    id: 'usr_staff_102',
    username: '9079909813',
    name: 'PRITI VERMA',
    employeeCode: '102',
    designation: 'Administrator & Teacher',
    department: 'ADMINISTRATIVE & MANAGEMENT',
    role: 'STAFF',
    privilegeId: 3,
    schoolId: 'sch_jd_intl',
    schoolName: 'J D International School',
    schoolCode: '10964',
    sessionId: '2026-2027',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    email: 'priti.verma@jdisjr.com'
  },
  STUDENT: {
    id: 'usr_std_822',
    username: '6377281034',
    name: 'AADHYA CHOUDHARY',
    studentId: '822',
    srNo: '2059',
    rollNo: '14',
    className: 'Nursery - PP3+',
    division: 'A',
    fatherName: 'OM PRAKASH JAT',
    motherName: 'KIRAN JAT',
    contactNo: '6377281034',
    dob: '2022-12-20',
    gender: 'Female',
    bloodGroup: 'O+',
    address: 'Mahapura, Ajmer Road, Jaipur, Rajasthan - 302026',
    role: 'STUDENT',
    privilegeId: 4,
    schoolId: 'sch_jd_intl',
    schoolName: 'J D International School',
    schoolCode: '10964',
    sessionId: '2026-2027',
    avatar: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=150',
    attendancePercent: 92,
    todayStatus: 'Ab',
    feeStatus: 'Due',
    totalFees: 21700,
    paidFees: 0,
    dueAmount: 21700
  },

  // ==================== SCHOOL B: DELHI PUBLIC ACADEMY ====================
  ADMIN_B: {
    id: 'usr_admin_sch_b',
    username: '9810011223',
    name: 'Principal V. K. Sharma',
    role: 'ADMIN',
    privilegeId: 2,
    schoolId: 'sch_dps_branch2',
    schoolName: 'Delhi Public Academy',
    schoolCode: 'DPA-2026',
    sessionId: '2026-2027',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    email: 'principal@dpsacademy.edu.in'
  },
  STAFF_B: {
    id: 'usr_staff_dps_301',
    username: '9810022334',
    name: 'RAJESH GUPTA',
    employeeCode: 'DPS-301',
    designation: 'Head of Mathematics',
    department: 'ACADEMICS',
    role: 'STAFF',
    privilegeId: 3,
    schoolId: 'sch_dps_branch2',
    schoolName: 'Delhi Public Academy',
    schoolCode: 'DPA-2026',
    sessionId: '2026-2027',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    email: 'r.gupta@dpsacademy.edu.in'
  },
  STUDENT_B: {
    id: 'usr_std_dps_101',
    username: '9810033445',
    name: 'ROHAN SHARMA',
    studentId: 'dps_101',
    srNo: '501',
    rollNo: '1',
    className: 'Class 10',
    division: 'A',
    fatherName: 'SUNIL SHARMA',
    motherName: 'MEENA SHARMA',
    role: 'STUDENT',
    privilegeId: 4,
    schoolId: 'sch_dps_branch2',
    schoolName: 'Delhi Public Academy',
    schoolCode: 'DPA-2026',
    sessionId: '2026-2027',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    attendancePercent: 96,
    feeStatus: 'Partial',
    dueAmount: 17000
  }
};

export const AVAILABLE_SCHOOLS = [
  {
    id: 'sch_jd_intl',
    name: 'J D International School',
    code: '10964',
    city: 'Jaipur',
    board: 'CBSE'
  },
  {
    id: 'sch_dps_branch2',
    name: 'Delhi Public Academy',
    code: 'DPA-2026',
    city: 'New Delhi',
    board: 'CBSE'
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('uab_user');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || 'demo_token';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('uab_user', JSON.stringify(user));
      localStorage.setItem('user_role', user.role);
      localStorage.setItem('active_school_id', user.schoolId || 'sch_jd_intl');
    } else {
      localStorage.removeItem('uab_user');
      localStorage.removeItem('user_role');
      localStorage.removeItem('token');
      localStorage.removeItem('active_school_id');
    }
  }, [user]);

  const login = (userData, userToken = 'demo_token') => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('uab_user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
    localStorage.setItem('user_role', userData.role);
    localStorage.setItem('active_school_id', userData.schoolId || 'sch_jd_intl');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('uab_user');
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('active_school_id');
  };

  const switchRole = (targetRole) => {
    if (DEMO_USERS[targetRole]) {
      const targetUser = DEMO_USERS[targetRole];
      login(targetUser, `token_${targetRole.toLowerCase()}`);
    }
  };

  // Instant Multi-Tenant Switcher between School A, School B, SuperAdmin, and self-registered schools
  const switchSchool = (targetSchoolId) => {
    if (targetSchoolId === 'sch_dps_branch2') {
      login(DEMO_USERS.ADMIN_B, 'token_admin_b');
    } else if (targetSchoolId === 'sch_jd_intl') {
      login(DEMO_USERS.ADMIN, 'token_admin_a');
    } else if (targetSchoolId === 'superadmin' || targetSchoolId === null) {
      login(DEMO_USERS.SUPER_ADMIN, 'token_superadmin');
    } else {
      // Find among self-registered schools
      const registered = tenantStore.getRegisteredSchools();
      const found = registered.find((s) => s.id === targetSchoolId);
      if (found) {
        const customUser = {
          id: `usr_${found.adminMobile || found.id}`,
          username: found.adminMobile || 'admin',
          name: `${found.schoolName} Admin`,
          role: 'ADMIN',
          privilegeId: 2,
          schoolId: found.id,
          schoolName: found.schoolName,
          schoolCode: found.schoolCode || 'SCH-NEW',
          sessionId: '2026-2027',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
        };
        login(customUser, `token_${found.id}`);
      }
    }
  };

  const isAuthenticated = Boolean(user);
  const currentRole = user?.role || 'GUEST';
  const schoolId = user?.schoolId !== undefined ? user.schoolId : (currentRole === 'SUPER_ADMIN' ? null : 'sch_jd_intl');
  const schoolName = user?.schoolName || (schoolId ? 'Registered School' : 'Unified School ERP');
  const schoolCode = user?.schoolCode || 'SCH-101';

  const allAvailableSchools = [
    ...AVAILABLE_SCHOOLS,
    ...tenantStore.getRegisteredSchools().map((s) => ({
      id: s.id,
      name: s.schoolName,
      code: s.schoolCode || 'NEW',
      color: 'from-amber-600 to-orange-700'
    }))
  ];

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        role: currentRole,
        schoolId,
        schoolName,
        schoolCode,
        isSuperAdmin: currentRole === 'SUPER_ADMIN',
        isAdmin: currentRole === 'ADMIN' || currentRole === 'SUPER_ADMIN',
        isStaff: currentRole === 'STAFF',
        isStudent: currentRole === 'STUDENT',
        login,
        logout,
        switchRole,
        switchSchool,
        AVAILABLE_SCHOOLS: allAvailableSchools,
        DEMO_USERS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
