#include <iostream>
#include <vector>
using namespace std;

void swap(int &val1,int &val2){
    int temp=val1;
    val1=val2;
    val2=temp;
}

void display(const vector<int> &vec){
    for(int ix=0;ix<vec.size();++ix){
        cout<<vec[ix]<<' ';
        cout<<endl;
    }
}

void display_pointer(const vector<int> *vec){
    if(!vec){
        cout<<"the vector pointer is 0\n";
        return;
    }
    for(int ix=0;ix<vec->size();++ix){
        cout<<(*vec)[ix]<<' ';
        cout<<endl;
    }
}

int main(){
    int ia[8]={8,34,3,13,1,21,5,2};
    vector<int> vec(ia,ia+8);

    cout<<"vector before sort:";
    display(vec);
    display_pointer(&vec);

    // bubble_sort(vec)

    // cout<<"vector after sort:"

    // display(vec)
    int a=3,b=5;
    swap(a,b);
    cout<<"a:"<<a;
    cout<<"b:"<<b;
    cout<<endl;
    return 0;
}